import { startOfDay } from "date-fns";
import { derive_months } from "./utils";

const day_width = 32;
export const TableHeader = ($: { all_dates: Date[] }) => {
  const today = startOfDay(new Date()).valueOf();
  const months = derive_months($.all_dates);

  const years = months.reduce(
    (acc, v) => {
      let found = acc.find((x) => x.name === v.year);
      if (!found) {
        found = { name: v.year, days_in_year: 0 };
        acc.push(found);
      }
      found.days_in_year += v.days_in_month;
      return acc;
    },
    [] as { name: number; days_in_year: number }[],
  );

  return (
    <div className="head flex border-b">
      <div className="w-36 border-r flex items-center justify-center">Номер машины</div>
      <div>
        <div className="years flex  border-b">
          {years.map((v) => (
            <div key={v.name} className="year px-2 border-r" style={{ width: `${v.days_in_year * day_width}px` }}>
              <div className="name">{v.name}</div>
            </div>
          ))}
        </div>
        <div className="months flex text-center">
          {months.map((v) => (
            <div
              key={v.name}
              className="month border-r border-b"
              style={{ width: `${v.days_in_month * day_width}px` }}
            >
              <div className="name">{v.name}</div>
            </div>
          ))}
        </div>
        <div className="days flex text-center bg-blue-500 text-white">
          {$.all_dates.map((v) => (
            <div key={v.getTime()} className={"iday border-r " + (v.valueOf() === today && "today")}>
              <div className="name">{v.getDate()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
