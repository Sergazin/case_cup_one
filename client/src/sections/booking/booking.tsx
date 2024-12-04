import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RepoCubit } from "@/repo";
import { useStore } from "@nanostores/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import Swal from "sweetalert2";
import { container_type_to_string } from "../trucks_calendar/utils";

export default function BookingList() {
  const repo = useStore(RepoCubit.state);
  const nav = useNavigate();
  const { contract_uuid } = useParams({ strict: true, from: "/bookings/$contract_uuid" });
  const contract = repo.contracts.find((c) => c.uuid === contract_uuid);
  if (!contract) return null;
  const sites = repo.sites.filter((site) => site.contract_uuid === contract_uuid);

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4 flex gap-4 border-b pb-4 mb-8">
        <Button onClick={() => nav({ to: "/booking" })}>
          <i className="bx bx-arrow-back "></i>
        </Button>
        <div className="grow">{contract.name}</div>
        <Button onClick={() => nav({ to: `/bookings/create/${contract_uuid}` })}>
          <i className="bx bx-plus mr-2"></i>
          Добавить пункт сбора
        </Button>
        <Button
          className="bg-red-500 text-white"
          onClick={async () => {
            const result = await Swal.fire({
              title: "Вы уверены?",
              text: "Вы хотите архивировать этот договор?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Да",
              cancelButtonText: "Нет",
            });
            if (result.isConfirmed) {
              try {
                await RepoCubit.archive_contract(contract_uuid);
                nav({ to: "/booking" });
                Swal.fire("Архивировано!", "Договор успешно архивирован", "success");
              } catch (e) {
                Swal.fire("Ошибка", "Не удалось архивировать договор", "error");
              }
            }
          }}
        >
          Архивировать
        </Button>
      </h1>

      <div className="space-y-4">
        {sites.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <i className="bx bx-error text-4xl text-red-500 mb-4"></i>
            <h1 className="text-2xl font-bold mb-4">Нет пунктов сбора</h1>
            <p className="text-gray-500">Пункты сбора для этого договора еще не созданы</p>
          </div>
        ) : (
          sites.map((site) => {
            const truck = repo.garbage_trucks.find((truck) => truck.uuid === site.truck_uuid);
            return (
              <Card
                key={site.uuid}
                onClick={() => {
                  //nav({to:"/bookings/$contract_uuid
                }}
              >
                <CardHeader className="hidden">
                  <CardTitle className="flex items-center">
                    <i className="bx bxs-map text-2xl mr-2"></i>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2 pt-4">
                    <i className="bx bxs-buildings text-xl mr-2 inline-block"></i>
                    <span>Пункт выдачи {site.name}</span>
                  </p>
                  <p className="mb-2">
                    <i className="bx bxs-truck text-xl mr-2 inline-block"></i>
                    Мусоровоз: {truck?.plate_no}
                  </p>
                  <h3 className="font-semibold mt-4 mb-2">Контейнеры:</h3>
                  <ul className="list-disc list-inside">
                    {site.container_on_site.map((container) => (
                      <li key={container.container_type.name} className="flex items-center">
                        <i className="bx bx-package text-xl mr-2"></i>
                        <span>
                          {container_type_to_string(container.container_type.name)}: {container.quantity} шт.
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-4">
                    <Button
                      className="bg-primary text-white mt-4"
                      onClick={() => {
                        nav({ to: "/site/edit/$site_uuid", params: { site_uuid: site.uuid } });
                      }}
                    >
                      Редактировать <i className="bx bx-pencil ml-2"></i>
                    </Button>
                    <Button
                      className="bg-red-500 text-white mt-4"
                      onClick={async () => {
                        const x = await Swal.fire({
                          title: "Вы уверены?",
                          text: "Вы хотите удалить этот пункт сбора?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonText: "Да",
                          cancelButtonText: "Нет",
                        });
                        if (x.isConfirmed) await RepoCubit.archive_site(site.uuid);
                      }}
                    >
                      Удалить <i className="bx bx-trash ml-2"></i>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
