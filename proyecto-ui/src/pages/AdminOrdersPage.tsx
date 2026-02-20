import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Table as TableType, listTablesApi } from "../api/tables.api";
import {
  type Order,
  listOrdersAdminApi,
  createOrderApi,
  updateOrderApi,
  deleteOrderApi,
} from "../api/orders.api";

export default function AdminOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [tables, setTables] = useState<TableType[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [tableId, setTableId] = useState<number>(0);
  const [itemsSummary, setItemsSummary] = useState("");
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("Pending");

  const load = async () => {
    try {
      setError("");
      const data = await listOrdersAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar orders. ¿Login? ¿Token admin?");
    }
  };

  const loadTables = async () => {
    try {
      const data = await listTablesApi();
      setTables(data.results); // DRF paginado
      if (!tableId && data.results.length > 0) setTableId(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => {
    load();
    loadTables();
  }, []);

  const save = async () => {
    try {
      setError("");
      if (!tableId) return setError("Seleccione una mesa");
      if (!itemsSummary.trim()) return setError("Items summary es requerido");

      const payload = {
        table_id: Number(tableId),
        items_summary: itemsSummary.trim(),
        total: Number(total),
        status: status,
      };

      if (editId) await updateOrderApi(editId, payload);
      else await createOrderApi(payload);

      setEditId(null);
      setItemsSummary("");
      setTotal(0);
      setStatus("Pending");
      await load();
    } catch {
      setError("No se pudo guardar order. ¿Token admin?");
    }
  };

  const startEdit = (o: Order) => {
    setEditId(o.id);
    setTableId(o.table_id);
    setItemsSummary(o.items_summary);
    setTotal(o.total);
    setStatus(o.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteOrderApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar order. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Admin Orders (Privado)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 260 }}>
              <InputLabel id="table-label">Mesa</InputLabel>
              <Select
                labelId="table-label"
                label="Mesa"
                value={tableId}
                onChange={(e) => setTableId(Number(e.target.value))}
              >
                {tables.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name} (#{t.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Items Summary"
              value={itemsSummary}
              onChange={(e) => setItemsSummary(e.target.value)}
              fullWidth
            />
            <TextField
              label="Total"
              type="number"
              value={total}
              onChange={(e) => setTotal(Number(e.target.value))}
              sx={{ width: 160 }}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <FormControl sx={{ width: 220 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="In_process">In Process</MenuItem>
                <MenuItem value="Served">Served</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" onClick={save}>
              {editId ? "Actualizar" : "Crear"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setEditId(null);
                setItemsSummary("");
                setTotal(0);
                setStatus("Pending");
              }}
            >
              Limpiar
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                load();
                loadTables();
              }}
            >
              Refrescar
            </Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.table_id_name ?? o.table_id}</TableCell>
                <TableCell>{o.items_summary}</TableCell>
                <TableCell>${o.total}</TableCell>
                <TableCell>{o.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(o)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => remove(o.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
