import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';

import { HabitsList } from './HabitsList';
import { ProgressBar } from './ProgressBar';

interface HabitDayProps {
  date: Date;
  amount?: number;
  defaultCompleted?: number;
}

export function HabitDay({ amount = 0, defaultCompleted = 0, date }: HabitDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted);

  const completedPercetage = amount > 0 ? Math.round((completed / amount) * 100) : 0;

  const dayAndMonth = dayjs(date).format('DD/MM');
  const dayOfWeek = dayjs(date).format('dddd');
  const today = dayjs().startOf('day').toDate();
  const isCurrentDay = dayjs(date).isSame(today);

  const handleCompletedChanged = async (completed: number) => {
    setCompleted(completed)
  }

  return (
    <Popover.Root>
      <Popover.Trigger
        className={clsx("w-10 h-10 rounded-lg cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-600 focus:ring-offset-background", {
          "bg-zinc-900 border-zinc-800": completedPercetage === 0,
          "bg-violet-900 border-violet-800": completedPercetage > 0 && completedPercetage < 20,
          "bg-violet-800 border-violet-700": completedPercetage >= 20 && completedPercetage < 40,
          "bg-violet-700 border-violet-600": completedPercetage >= 40 && completedPercetage < 60,
          "bg-violet-600 border-violet-500": completedPercetage >= 60 && completedPercetage < 80,
          "bg-violet-500 border-violet-400": completedPercetage >= 80,
          "border-white border-2": isCurrentDay
        })}
      />

      <Popover.Portal>
        <Popover.Content className="min-w-[320px] p-6 rounded-2xl bg-zinc-900 flex flex-col">
          <span className="font-semibold text-zinc-400">{dayOfWeek}</span>
          <span className="mt-1 font-extrabold leading-tight text-3xl">{dayAndMonth}</span>

          <ProgressBar progress={completedPercetage} />

          <HabitsList date={date} onCompletedChanged={handleCompletedChanged} />

          <Popover.Arrow height={8} width={16} className="fill-zinc-900" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root >
  )
}