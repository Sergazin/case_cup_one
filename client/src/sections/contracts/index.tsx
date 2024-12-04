import HelpCard from "@/components/help_card";
import ContractList from "./list";

export default function ContractsMain() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Список Договоров</h1>
      <ContractList onContractClick={() => {}} />
      <div className="helpers flex gap-4 items-start mt-8 border-t pt-8 justify-start w-full">
        <HelpCard
          title="Источник данных"
          text="Договора подгруженны из Excel таблицы. Для добавления новых договоров, загрузите новый файл."
        />
      </div>
    </div>
  );
}
