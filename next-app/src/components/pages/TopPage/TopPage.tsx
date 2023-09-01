'use client';
import CheckBox from "@/components/atoms/CheckBox/CheckBox";
import { memo, useReducer, useCallback, Reducer } from "react";
import Button from "@/components/atoms/Button/Button";
import React from "react";

type WeekDayObjType = {
  id: string;
  text: string;
  value: boolean;
};

type TargetWeekDayReducerActionType = {
  type: 'setCheck';
  payload: {
    id: string;
    value: boolean;
  }[];
};

const targetWeekDaysReducer = (state: WeekDayObjType[], action: TargetWeekDayReducerActionType): WeekDayObjType[] => {
  const nextState = [...state];
  if (action.type === 'setCheck') {
    action.payload.forEach(({id, value}) => {
      const targetIndex = nextState.findIndex((weekDayObj) => weekDayObj.id === id);
      if (targetIndex === -1) return;
      nextState[targetIndex] = {...nextState[targetIndex], value};
    });
  }
  return nextState;
};

const TopPage = () => {
  const [targetWeekDays, dispatchTargetWeekDays] = useReducer<Reducer<WeekDayObjType[], TargetWeekDayReducerActionType>>(targetWeekDaysReducer, (() => {
    const defaultValue = {
      value: true
    };
    return [
      {
        id: 'Monday',
        text: '月',
        ...defaultValue
      },
      {
        id: 'Tuesday',
        text: '火',
        ...defaultValue
      },
      {
        id: 'Wednesday',
        text: '水',
        ...defaultValue
      },
      {
        id: 'Thursday',
        text: '木',
        ...defaultValue
      },
      {
        id: 'Friday',
        text: '金',
        ...defaultValue
      },
      {
        id: 'Saturday',
        text: '土',
        ...defaultValue
      },
      {
        id: 'Sunday',
        text: '日',
        ...defaultValue
      },
      {
        id: 'Holiday',
        text: '祝日',
        ...defaultValue
      }
    ];
  })());

  
  const checkboxHandler = useCallback((id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatchTargetWeekDays({
      type: 'setCheck',
      payload: [
        {
          id,
          value: event.target.checked
        }
      ]
    })
  }, []);



  const allCheckboxHandler = useCallback((value: boolean) => {
    dispatchTargetWeekDays({
      type: 'setCheck',
      payload: targetWeekDays.map(({id}) => ({
        id,
        value
      }))
    });
  }, [targetWeekDays]);

  const allCheckHandler = useCallback(() => dispatchTargetWeekDays({
    type: 'setCheck',
    payload: targetWeekDays.map(({id}) => ({
      id,
      value: true
    }))
  }), [targetWeekDays]);

  const allNotCheckHandler = useCallback(() => dispatchTargetWeekDays({
    type: 'setCheck',
    payload: targetWeekDays.map(({id}) => ({
      id,
      value: false
    }))
  }), [targetWeekDays]);

  // 平日のみ選択
  const weekdaysCheckHandler = useCallback(() => dispatchTargetWeekDays({
    type: 'setCheck',
    payload: targetWeekDays.flatMap(({id}) => {
      if (['Saturday', 'Sunday', 'Holiday'].includes(id)) return [];
      return {
        id,
        value: true
      }
    })
  }), [targetWeekDays]);

  return (
    <main>
    <h1>毎日5時に天気予報</h1>
    <div>
      <h2>通知設定</h2>
      <h3>通知したい曜日</h3>
      <form>
        {targetWeekDays.map(({id, text, value}) => <CheckBox key={id} checked={value} id={`checkbox${id}`} onChange={checkboxHandler(id)} >{text}</CheckBox>)}
        <div>
          <Button onClick={allCheckHandler}>全て選択</Button>
          <Button onClick={allNotCheckHandler}>全て選択解除</Button>
          <Button onClick={weekdaysCheckHandler}>平日のみ選択</Button>
        </div>
        <Button>設定を更新</Button>
      </form>
    </div>
    </main>
  );
};

export default memo(TopPage);