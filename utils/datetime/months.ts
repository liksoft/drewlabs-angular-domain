export interface Month {
  id: number;
  label: string;
  enLabel: string;
}

export class MonthProvider {
  /**
   * @description Returns a month object based on the provided month id
   * @param value Id of a month in the list of predefined month
   */
  public static parseMonth(
    value: number,
    lang: string = "fr"
  ): string | number {
    const filteredMonth = MONTHS.filter((v: Month) => {
      return +v.id === +value;
    });
    return filteredMonth.length > 0
      ? lang !== "fr"
        ? filteredMonth[0].enLabel
        : filteredMonth[0].label
      : value;
  }
}

/**
 * @description List of [[Month]] instances
 */
export const MONTHS: Month[] = [
  {
    id: 1,
    label: "Janvier",
    enLabel: "January",
  },
  {
    id: 2,
    label: "Février",
    enLabel: "February",
  },
  {
    id: 3,
    label: "Mars",
    enLabel: "March",
  },
  {
    id: 4,
    label: "Avril",
    enLabel: "April",
  },
  {
    id: 5,
    label: "Mai",
    enLabel: "May",
  },
  {
    id: 6,
    label: "Juin",
    enLabel: "June",
  },
  {
    id: 7,
    label: "Juillet",
    enLabel: "July",
  },
  {
    id: 8,
    label: "Août",
    enLabel: "August",
  },
  {
    id: 9,
    label: "Septembre",
    enLabel: "September",
  },
  {
    id: 10,
    label: "Octobre",
    enLabel: "October",
  },
  {
    id: 11,
    label: "Novembre",
    enLabel: "November",
  },
  {
    id: 12,
    label: "Décembre",
    enLabel: "December",
  },
];
