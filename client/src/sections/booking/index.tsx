import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import ContractList from "../contracts/list";
import HelpCard from "@/components/help_card";
import { Button } from "@/components/ui/button";
import NewContractForm from "./new_contract_form";
import { useNavigate } from "@tanstack/react-router";

export const BookingMain: React.FC = () => {
  const [open, set_open] = React.useState(false);
  const nav = useNavigate();
  return (
    <>
      <ContractList
        non_import_mode={true}
        onContractClick={(contract_uuid) => {
          nav({ to: "/bookings/$contract_uuid", params: { contract_uuid } });
        }}
      />

      <div className="flex justify-between items-center mb-4"></div>
      <Button onClick={() => set_open(true)}>Добавить бронирование</Button>
      <div className="helpers flex gap-4 items-start mt-8 border-t pt-8 justify-start w-full">
        <HelpCard
          title="Источник данных"
          text="Данные о бронировании подгруженны не из Excel таблицы, а из нашей базы данных. Чтобы добавить новое бронирование, нажмите кнопку 'Добавить бронирование'."
        />
        <HelpCard
          title="Актуализация данных"
          text="После создания договора в Вашей ИС, необходимо заархивировать его в нашей системе. Иначе они будут дублироваться"
        />
      </div>
      <Dialog open={open} onOpenChange={set_open}>
        <DialogContent onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Новое бронирование</DialogTitle>
            <DialogDescription>Выберите контракт и дату</DialogDescription>
          </DialogHeader>
          <NewContractForm onClose={() => set_open(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};
