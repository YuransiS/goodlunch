// lib/menuData.ts

export type Dish = {
  id: string;
  type: 'breakfast' | 'soup' | 'main1' | 'main2';
  title: string;
}

export type DayMenu = {
  dayIndex: number; // 1 = Monday, ..., 7 = Sunday
  dishes: Dish[];
}

export type WeekMenu = DayMenu[];

export const week1Menu: WeekMenu = [
  {
    dayIndex: 1, // Poniedziałek
    dishes: [
      { id: 'w1-d1-b', type: 'breakfast', title: 'Szakszuka w sosie pomidorowym' },
      { id: 'w1-d1-s', type: 'soup', title: 'Barszcz czerwony' },
      { id: 'w1-d1-m1', type: 'main1', title: 'Pierogi ruskie' },
      { id: 'w1-d1-m2', type: 'main2', title: 'Schabowy + ziemniaki + surówka' },
    ]
  },
  {
    dayIndex: 2, // Wtorek
    dishes: [
      { id: 'w1-d2-b', type: 'breakfast', title: 'Pudding chia z jogurtem i owocami' },
      { id: 'w1-d2-s', type: 'soup', title: 'Rosół' },
      { id: 'w1-d2-m1', type: 'main1', title: 'Ryż z kurczakiem teriyaki' },
      { id: 'w1-d2-m2', type: 'main2', title: 'Kasza gryczana + gulasz po węgiersku' },
    ]
  },
  {
    dayIndex: 3, // Środa
    dishes: [
      { id: 'w1-d3-b', type: 'breakfast', title: 'Bajgiel z jajkiem i bekonem' },
      { id: 'w1-d3-s', type: 'soup', title: 'Zupa z soczewicy' },
      { id: 'w1-d3-m1', type: 'main1', title: 'Makaron z pesto i pieczonym kurczakiem' },
      { id: 'w1-d3-m2', type: 'main2', title: 'Ragu z mięsem wieprzowym' },
    ]
  },
  {
    dayIndex: 4, // Czwartek
    dishes: [
      { id: 'w1-d4-b', type: 'breakfast', title: 'Naleśniki z waniliowym twarogiem i dżemem' },
      { id: 'w1-d4-s', type: 'soup', title: 'Zupa warzywna z kurczakiem' },
      { id: 'w1-d4-m1', type: 'main1', title: 'Kasza gryczana + kotlety drobiowe + sos warzywny' },
      { id: 'w1-d4-m2', type: 'main2', title: 'Placki ziemniaczane z sosem szpinakowym' },
    ]
  },
  {
    dayIndex: 5, // Piątek
    dishes: [
      { id: 'w1-d5-b', type: 'breakfast', title: 'Sałatka z kurczakiem i sosem jogurtowym' },
      { id: 'w1-d5-s', type: 'soup', title: 'Barszcz zielony' },
      { id: 'w1-d5-m1', type: 'main1', title: 'Bulgur w sosie śmietanowo-grzybowym z pulpetami z kurczaka' },
      { id: 'w1-d5-m2', type: 'main2', title: 'Makaron 4 sery' },
    ]
  },
  {
    dayIndex: 6, // Sobota
    dishes: [
      { id: 'w1-d6-b', type: 'breakfast', title: 'Granola z jogurtem naturalnym i dżemem' },
      { id: 'w1-d6-s', type: 'soup', title: 'Zupa gryczana' },
      { id: 'w1-d6-m1', type: 'main1', title: 'Makaron à la bolognese' },
      { id: 'w1-d6-m2', type: 'main2', title: 'Krokiety z mięsem' },
    ]
  },
  {
    dayIndex: 7, // Niedziela
    dishes: [
      { id: 'w1-d7-b', type: 'breakfast', title: 'Frittata z warzywami' },
      { id: 'w1-d7-s', type: 'soup', title: 'Zupa z pulpetami' },
      { id: 'w1-d7-m1', type: 'main1', title: 'Żulien z kurczakiem i grzybami + purée ziemniaczane' },
      { id: 'w1-d7-m2', type: 'main2', title: 'Kasza jaglana z pulpetami' },
    ]
  },
];

export const week2Menu: WeekMenu = [
  {
    dayIndex: 1, // Poniedziałek
    dishes: [
      { id: 'w2-d1-b', type: 'breakfast', title: 'Omlet z parówkami' },
      { id: 'w2-d1-s', type: 'soup', title: 'Pomidorowa' },
      { id: 'w2-d1-m1', type: 'main1', title: 'Purée + kotlet mielony' },
      { id: 'w2-d1-m2', type: 'main2', title: 'Makaron z pesto i mozzarellą' },
    ]
  },
  {
    dayIndex: 2, // Wtorek
    dishes: [
      { id: 'w2-d2-b', type: 'breakfast', title: 'Chia z jogurtem i mango' },
      { id: 'w2-d2-s', type: 'soup', title: 'Ogórkowa' },
      { id: 'w2-d2-m1', type: 'main1', title: 'Ryż z kurczakiem teriyaki' },
      { id: 'w2-d2-m2', type: 'main2', title: 'Naleśniki z kurczakiem i grzybami' },
    ]
  },
  {
    dayIndex: 3, // Środa
    dishes: [
      { id: 'w2-d3-b', type: 'breakfast', title: 'Pancakes z dipami' },
      { id: 'w2-d3-s', type: 'soup', title: 'Kapuśniak' },
      { id: 'w2-d3-m1', type: 'main1', title: 'Schabowy + ziemniaki + surówka' },
      { id: 'w2-d3-m2', type: 'main2', title: 'Pasta z warzywami i parmezanem' },
    ]
  },
  {
    dayIndex: 4, // Czwartek
    dishes: [
      { id: 'w2-d4-b', type: 'breakfast', title: 'Angielskie śniadania' },
      { id: 'w2-d4-s', type: 'soup', title: 'Zupa serowa' },
      { id: 'w2-d4-m1', type: 'main1', title: 'Ragu z mięsem wieprzowym' },
      { id: 'w2-d4-m2', type: 'main2', title: 'Krokiety z mozzarellą i grzybami' },
    ]
  },
  {
    dayIndex: 5, // Piątek
    dishes: [
      { id: 'w2-d5-b', type: 'breakfast', title: 'Kanapka z szynką, jajkiem i serem' },
      { id: 'w2-d5-s', type: 'soup', title: 'Grzybowa' },
      { id: 'w2-d5-m1', type: 'main1', title: 'Kasza gryczana + gulasz po węgiersku' },
      { id: 'w2-d5-m2', type: 'main2', title: 'Bowl z warzywami i jajkiem sadzonym' },
    ]
  },
  {
    dayIndex: 6, // Sobota
    dishes: [
      { id: 'w2-d6-b', type: 'breakfast', title: 'jajka po turecku' },
      { id: 'w2-d6-s', type: 'soup', title: 'Solianka' },
      { id: 'w2-d6-m1', type: 'main1', title: 'Makaron à la bolognese' },
      { id: 'w2-d6-m2', type: 'main2', title: 'Naleśniki z mięsem' },
    ]
  },
  {
    dayIndex: 7, // Niedziela
    dishes: [
      { id: 'w2-d7-b', type: 'breakfast', title: 'Serniczki' },
      { id: 'w2-d7-s', type: 'soup', title: 'Charczo' },
      { id: 'w2-d7-m1', type: 'main1', title: 'Purée + kotlet mielony' },
      { id: 'w2-d7-m2', type: 'main2', title: 'Hamburger classic' },
    ]
  },
];

/**
 * Calculates which week applies to the given date and returns the day's menu.
 * We know that Jan 14, 2026 is a Wednesday and falls on Week 2.
 * The preceding Monday for that week is Jan 12, 2026.
 */
export function getMenuForDate(date: Date): { weekNumber: number; menu: DayMenu } {
  // Use UTC to avoid timezone issues when calculating days difference
  const targetDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
  // Anchor date: Jan 12, 2026 (Monday of Week 2)
  const anchorDate = new Date(Date.UTC(2026, 0, 12));
  
  const diffTime = targetDate.getTime() - anchorDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Calculate offset in weeks from anchor week.
  // diffDays could be negative, so we use Math.floor
  const weeksDiff = Math.floor(diffDays / 7);
  
  // Since anchor is Week 2, add 1 (to represent week 1 index, so 2 - 1)
  // Week sequence alternates: Week 1 or Week 2.
  // if weeksDiff is even, it's Week 2. if odd, it's Week 1.
  const isWeek2 = weeksDiff % 2 === 0;
  
  // Find correct day of week index (1 = Monday, 7 = Sunday)
  let dayOfWeek = targetDate.getUTCDay();
  // In JS, 0 is Sunday. Convert to 1-7 where 1 is Monday.
  dayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
  
  const selectedWeek = isWeek2 ? week2Menu : week1Menu;
  const menu = selectedWeek.find(d => d.dayIndex === dayOfWeek)!;
  
  return {
    weekNumber: isWeek2 ? 2 : 1,
    menu
  };
}

export function generateUpcomingDays(startDate: Date, count: number): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
}
