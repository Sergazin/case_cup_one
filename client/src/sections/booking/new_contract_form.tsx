/*
use boxicons. all text in russian.
create new contract form.
It can be contract or additional agreement to existing contract.
Fields:
1. Counterparty (select from org_uuid codes and names from the table: (uuid, name))
2. Type (select from: Contract, Additional agreement)
2.1. If Additional agreement selected, then select parent contract (select from contract codes and names from the table: (uuid, name))
3. Name (text)
4. Start date (date)
5. End date (date)

* **/

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useStore } from "@nanostores/react";
import { RepoCubit } from "@/repo";
import { ContractPublic } from "@/ts_client";
import Swal from "sweetalert2";
import { useNavigate } from "@tanstack/react-router";

export default function NewContractForm($: { onClose: () => void }) {
  const repo = useStore(RepoCubit.state);
  const nav = useNavigate();
  const [org_uuid, set_org_uuid] = useState<string>("");
  const [type, setType] = useState<"contract" | "additional">("contract");
  const [parentContract, setParentContract] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const create_contract = async () => {
    if (!org_uuid || !type || !name || !startDate || !endDate || (type === "additional" && !parentContract)) {
      Swal.fire({
        icon: "error",
        title: "Ошибка",
        text: "Заполните все поля",
      });
      return;
    }

    const parent_contract = repo.contracts.find((c) => c.uuid === parentContract);

    try {
      const data: ContractPublic = {
        organization_uuid: org_uuid,
        name: type === "contract" ? name : `${name} (дополнительное соглашение к ${parent_contract?.name})`,
        start_date: startDate.valueOf(),
        end_date: endDate.valueOf(),
        imported: false,
        archived: false,
      };
      const new_contract = await RepoCubit.create_contract(data);
      Swal.fire({
        icon: "success",
        title: "Успех",
        text: "Договор создан",
      });
      $.onClose();
      nav({ to: "/bookings/$contract_uuid", params: { contract_uuid: new_contract.uuid } });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Ошибка",
        text: "Не удалось создать договор",
      });
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="org_uuid">
            Контрагент
          </label>
          <Select value={org_uuid} onValueChange={set_org_uuid}>
            <SelectTrigger id="org_uuid">
              <SelectValue placeholder="Выберите контрагента" />
            </SelectTrigger>
            <SelectContent>
              {repo.organizations
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((c) => (
                  <SelectItem key={c.uuid} value={c.uuid}>
                    {c.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="type">
            Тип
          </label>
          <Select value={type} onValueChange={(value) => setType(value as "contract" | "additional")}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Выберите тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contract">Договор</SelectItem>
              <SelectItem value="additional">Дополнительное соглашение</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {type === "additional" && (
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="parentContract">
              Основной договор
            </label>
            <Select value={parentContract} onValueChange={setParentContract}>
              <SelectTrigger id="parentContract">
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent>
                {repo.contracts
                  .filter((v) => v.organization_uuid === org_uuid)
                  .map((c) => (
                    <SelectItem key={c.uuid} value={c.uuid}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="name">
            Наименование
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите наименование договора"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Дата начала</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
              >
                <i className="bx bx-calendar mr-2"></i>
                {startDate ? format(startDate, "PPP", { locale: ru }) : "Выберите дату начала"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={startDate} onSelect={setStartDate} locale={ru} />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Дата окончания</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
              >
                <i className="bx bx-calendar mr-2"></i>
                {endDate ? format(endDate, "PPP", { locale: ru }) : "Выберите дату окончания"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={endDate} onSelect={setEndDate} locale={ru} />
            </PopoverContent>
          </Popover>
        </div>

        <Button className="w-full" onClick={create_contract}>
          <i className="bx bx-save mr-2"></i>
          Сохранить
        </Button>
      </div>
    </>
  );
}
