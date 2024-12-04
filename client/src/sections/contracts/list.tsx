import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStore } from "@nanostores/react";
import { RepoCubit } from "@/repo";
import { formatDate } from "date-fns";

export default function ContractList($: {
  non_import_mode?: boolean;
  onContractClick: (contract_uuid: string) => void;
}) {
  const repo = useStore(RepoCubit.state);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const filteredContracts = repo.contracts
    .filter((c) => ($.non_import_mode ? !c.imported : c.imported))
    .filter((contract) =>
      Object.values(contract).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
    );

  const pageCount = Math.ceil(filteredContracts.length / itemsPerPage);
  const paginatedContracts = filteredContracts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-96"
          />
        </div>
        <div className="flex justify-between items-center mt-4 gap-4 mb-4">
          <div>
            Показано с {Math.min((currentPage - 1) * itemsPerPage + 1, filteredContracts.length)} по{" "}
            {Math.min(currentPage * itemsPerPage, filteredContracts.length)} из {filteredContracts.length}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
              <i className="bx bx-chevron-left"></i>
              Назад
            </Button>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              disabled={currentPage === pageCount}
            >
              <i className="bx bx-chevron-right"></i>
              Далее
            </Button>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer">Название</TableHead>
            <TableHead className="cursor-pointer">Контрагент</TableHead>
            <TableHead className="cursor-pointer">Дата Начала</TableHead>
            <TableHead className="cursor-pointer">Дата Окончания</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedContracts.map((contract) => {
            const org = repo.organizations.find((org) => org.uuid === contract.organization_uuid);
            return (
              <TableRow
                key={contract.uuid}
                onClick={() => $.onContractClick(contract.uuid)}
                className="cursor-pointer"
              >
                <TableCell>{contract.name}</TableCell>
                <TableCell>{org?.name}</TableCell>
                <TableCell>{formatDate(new Date(contract.start_date), "dd.MM.yyyy")}</TableCell>
                <TableCell>{formatDate(new Date(contract.end_date), "dd.MM.yyyy")}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
