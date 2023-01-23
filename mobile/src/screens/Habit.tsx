import { useRoute } from "@react-navigation/native";
import clsx from "clsx";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { HabitEmpty } from "../components/HabitEmpty";
import { Loading } from "../components/Loading";
import { ProgressBar } from "../components/ProgressBar";

interface Params {
  date: string;
}

interface DayInfoProps {
  completeHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[]
}

export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute();
  const { date } = route.params as Params;

  const parseDate = dayjs(date);
  const isDateInPast = parseDate.endOf('day').isBefore(new Date());
  const dayOfWeek = parseDate.format('dddd');
  const dayAndMonth = parseDate.format('DD/MM');

  const habitsProgress = dayInfo?.possibleHabits?.length
    ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
    : 0;

  async function fetchHabits() {
    try {
      setLoading(true);
      const response = await api.get("/day", { params: { date } })
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits ?? []);

    } catch (error) {
      console.log(error)
      Alert.alert("Ops!", "Não foi possível carregar as informações dos hábitos.")
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);

      if (completedHabits?.includes(habitId)) {
        setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
      } else {
        setCompletedHabits(prevState => [...prevState, habitId]);
      }
    } catch (error) {
      console.log(error)
      Alert.alert("Ops!", "Não foi possível o atualizar o status do hábito.")
    }
  }

  useEffect(() => {
    fetchHabits();
  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <View className="flex-1 px-8 pt-16 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-base font-semibold lowercase text-zinc-400">
          {dayOfWeek}
        </Text>

        <Text className="text-3xl font-extrabold text-white">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6", {
          ["opacity-50"]: isDateInPast
        })}>
          {
            dayInfo?.possibleHabits
              ? dayInfo.possibleHabits?.map(habit => {
                return (
                  <Checkbox
                    key={habit.id}
                    title={habit.title}
                    checked={completedHabits?.includes(habit.id)}
                    disabled={isDateInPast}
                    onPress={() => handleToggleHabit(habit.id)}
                  />
                )
              })
              : <HabitEmpty />
          }

        </View>

        {
          isDateInPast && (
            <Text className="mt-10 text-center text-white">
              Você não pode editar hábitos de datas passadas.
            </Text>
          )
        }

      </ScrollView>
    </View>
  )
}