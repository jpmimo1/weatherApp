import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ScrollArea } from '../ui/scroll-area';
import { DailyCard, HourlyCard, MainCard } from './components';
import styles from './styles.module.css';
import { cn } from '@/lib/utils';




export const WeatherDesk = () => {
  return (
    <ScrollArea className={cn('w-full h-full', styles.scrollVertical)}>
      <div className='flex flex-col p-4 gap-6 xl:flex-row xl:flex-nowrap lg:p-8 xl:gap-11'>
        <div className='flex flex-col gap-6 xl:max-w-[calc(100%_-_400px)] xl:gap-11 xl:w-full'>
          <MainCard />
          <HourlyCard />
        </div>
        <div className='xl:w-[400px]'>
          <DailyCard />
        </div>
      </div>
    </ScrollArea>
  )
}
