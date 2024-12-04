import React from "react";
import Upload from "./upload_el";
import HelpCard from "@/components/help_card";
import { Button } from "@/components/ui/button";

export const ImportScreen: React.FC = () => {
  return (
    <div>
      <Upload onUpload={() => {}} />
      <div className="text-center my-6">
        <a href="/samples/graph.xlsx" download className="text-blue-500 underline mt-4">
          <Button>
            <i className="bx bx-download"></i>
            Скачать Шаблон файла XLSX
          </Button>
        </a>
      </div>
      <div className="helpers flex gap-4 mt-8">
        <HelpCard
          title="Время загрузки"
          text="Загрузка данных может занять некоторое время, в зависимости от объема данных. Ожидайте до 2 минут."
        />
        <HelpCard
          title="Загрузка данных"
          text="Загрузите данные в формате XLSX, чтобы обновить график загрузки мусоровозов."
        />
        <HelpCard
          title="Формат данных"
          text="Убедитесь, что данные в файле соответствуют шаблону, иначе загрузка не выполнится."
        />
        <HelpCard
          title="Обновление графика"
          text="После загрузки данных, страница будет обновлена автоматически. Изменения будут видны сразу."
        />
      </div>
    </div>
  );
};
