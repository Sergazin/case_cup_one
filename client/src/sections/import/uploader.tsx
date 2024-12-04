// Copyright © 2024 Arman Sergazin (arman@sergazin.kz). All rights reserved.
// ==================================================================================
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { upload_start } from "./uploader";
import Swal from "sweetalert2";

export default function PDFUpload($: { onUpload: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [wip, set_wip] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Пожалуйста, выберите PDF файл.");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      alert("Пожалуйста, выберите PDF файл.");
    }
  };

  const start_upload = async () => {
    if (!file) return;
    set_wip(true);
    try {
      const url = await upload_start(file);
      $.onUpload(url);
      Swal.fire("Успешно", "Резюме успешно отправлено в обработку", "success");
      setFile(null);
    } catch (e) {
      Swal.fire("Ошибка", "Не удалось загрузить резюме", "error");
    }
    set_wip(false);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Загрузка Резюме в формате PDF</h1>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer h-64 flex flex-col justify-center items-center hover:border-gray-400 hover:bg-gray-50 transition"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          {file ? (
            <div className="space-y-2">
              <i className="bx bxs-file-pdf text-5xl text-red-500"></i>
              <p className="text-sm text-gray-600">{file.name}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <i className="bx bx-upload text-5xl text-gray-400"></i>
              <p className="text-gray-600">Перетащите PDF файл сюда или кликните для выбора</p>
            </div>
          )}
          <input id="fileInput" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
        </div>
        {file && (
          <div className="mt-4 flex justify-end">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => !wip && start_upload()}
              disabled={wip}
            >
              {wip ? <i className="bx bx-loader-alt animate-spin mr-2"></i> : <i className="bx bx-upload mr-2"></i>}
              {wip ? "Загрузка..." : "Загрузить"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
