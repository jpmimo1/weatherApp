import { useMediaQuery } from '@/hooks/useMediaQuery';
import React, { FormEventHandler, ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Drawer, DrawerContent, DrawerTrigger } from '../ui/drawer';
import { Button } from '../ui/button';
import { FaLocationDot } from 'react-icons/fa6';
import { CommandLoading } from 'cmdk';
import { SearchPlacesProvider, useSeachPlaces } from './context/Provider';
import { Skeleton } from '../ui/skeleton';
import { IoMdAdd } from 'react-icons/io';
import { toast } from 'react-toastify';
import { WeatherLocation, useWeatherStore } from '@/store/weatherApp';
import moment from 'moment';
import { weatherRequest } from '@/requests';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { placeToTexts } from '@/lib/placeToTexts';

const SearchPlacesComponent = ({ setAddNewFavoriteActive }: { setAddNewFavoriteActive: (active: boolean) => void }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const favoritesWeatherLocation = useWeatherStore(state => state.favoritesWeatherLocation);
  const { openCB, placeSelect, loadingAdd, dispatch } = useSeachPlaces();
  const refButton = useRef<HTMLButtonElement>(null);
  const addFavoriteWL = useWeatherStore(state => state.addFavoriteWL);

  const setOpen = (open: boolean) => {
    dispatch({ type: 'openCB - set', payload: open });
  }

  const onClickAdd: FormEventHandler<HTMLButtonElement> = async () => {
    try {
      dispatch({ type: 'loadingAdd - set', payload: true });
      if (!placeSelect) {
        toast.warning('You have to select a place');
        return;
      }

      const indexFavorite = favoritesWeatherLocation.findIndex(({ location }) => {
        return location?.place_id === placeSelect.place_id;
      })

      if (indexFavorite !== -1) {
        toast.warning('This place has already been added');
        return;
      }

      const { country, state, city, lat, lon, region, place_id } = placeSelect;
      const weather = await weatherRequest({ lat, lon });

      const newWL: WeatherLocation = {
        readingTime: moment().valueOf(),
        location: {
          country, state, city, lat, lon, region, place_id
        },
        weather: weather
      }
      addFavoriteWL(newWL);
      setAddNewFavoriteActive(false);

    } catch (e) {
      toast.error('There was an error adding the place');
    } finally {
      dispatch({ type: 'loadingAdd - set', payload: false });
    }
  };

  useEffect(() => {
    if (openCB === false && placeSelect) {
      setTimeout(() => {
        refButton.current?.focus();
      }, 400);
    }
  }, [openCB]);

  return (
    <>
      {isDesktop ? (
        <Popover open={openCB} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <ButtonSearch />
          </PopoverTrigger>
          <PopoverContent className="w-[250px] p-0" align='start'>
            <PlacesList />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={openCB} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <ButtonSearch />
          </DrawerTrigger>
          <DrawerContent>
            <div className="mt-4 border-t">
              <PlacesList />
            </div>
          </DrawerContent>
        </Drawer>
      )}
      <Button
        onClick={onClickAdd}
        ref={refButton} variant='outline'
        disabled={loadingAdd}
      >
        {loadingAdd ?
          <AiOutlineLoading3Quarters size='1.3em' className='mr-2 animate-spin' /> :
          <IoMdAdd size='1.3em' className='mr-2' />
        }
        Add
      </Button>
    </>
  )

};



const ButtonSearch = forwardRef(function ButtonSearch(
  { onClick }: { onClick?: () => void }, ref
) {
  const { placeSelect, openCB } = useSeachPlaces();
  const { state, city, country, region } = placeSelect || {};

  const { line1, line2 } = placeToTexts({ country: country || "", state, city, region });
  return (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={openCB}
      className="w-full justify-between min-w-0"
      ref={ref as ForwardedRef<HTMLButtonElement>}
      onClick={onClick}
    >
      {placeSelect
        ? (
          <div className='flex items-baseline gap-2 min-w-0'>
            <div className='font-normal text-left'>{`${line1}, `}</div>
            <div className='font-norma text-xs text-slate-600 text-left min-w-0 overflow-hidden text-ellipsis'>{line2}</div>
          </div>
        )
        : <div className='overflow-hidden min-w-0 text-ellipsis'>Search a place...</div>}
      <FaLocationDot className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>);
});



const PlacesList = () => {
  const { textSearch, placesList, loadingSeach, dispatch } = useSeachPlaces();

  const setTextSearch = (newText: string) => {
    dispatch({ type: 'textSearch - set', payload: newText });
  }


  return (
    <Command shouldFilter={false}>
      <CommandInput
        placeholder="Type a place..."
        className="h-9"
        value={textSearch}
        onValueChange={(newValue) => {
          setTextSearch(newValue);
        }}
      />
      {<CommandList className='min-h-[180px] max-h-[250px] relative'>
        {loadingSeach && <CommandLoading className=''><Skeleton className='h-full absolute top-0 left-0 w-full flex justify-center items-center text-sm'>Loading...</Skeleton></CommandLoading>}

        {!loadingSeach && placesList.length === 0 && textSearch.length === 0 && <CommandEmpty></CommandEmpty>}

        {!loadingSeach && placesList.length === 0 && textSearch.length > 0 && <CommandEmpty>Places not found...</CommandEmpty>}

        {!loadingSeach && placesList.length > 0 && placesList.map(({ place_id, country, state, city, region }) => {
          const { line1, line2 } = placeToTexts({ country, state, city, region });
          return (
            <CommandItem
              key={place_id}
              value={place_id}
              onSelect={(currentPlaceId) => {
                const placeSelect = placesList.find(({ place_id }) => currentPlaceId === place_id);
                dispatch({ type: 'placeSelect - set', payload: placeSelect })
                dispatch({ type: 'openCB - set', payload: false });
              }}
            >
              <div className='flex flex-col'>
                <div>{line1}</div>
                <div className='text-xs text-slate-600'>{line2}</div>
              </div>
            </CommandItem>
          )
        })}

      </CommandList>}

    </Command>
  )
}


export const SearchPlaces = ({ setAddNewFavoriteActive }: { setAddNewFavoriteActive: (active: boolean) => void }) => {
  return (
    <SearchPlacesProvider>
      <SearchPlacesComponent setAddNewFavoriteActive={setAddNewFavoriteActive} />
    </SearchPlacesProvider>
  );
}
