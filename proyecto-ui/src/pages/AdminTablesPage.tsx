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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  type Table as TableType,
  listTablesApi,
  createTableApi,
  updateTableApi,
  deleteTableApi,
} from "../api/tables.api";

export default function AdminTablesPage() {
  const [items, setItems] = useState<TableType[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(4);
  const [isAvailable, setIsAvailable] = useState(true);

  const load = async () => {
    try {
      setError("");
      const data = await listTablesApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar tables. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    try {
      setError("");
      if (!name.trim()) return setError("Nombre es requerido");

      const payload = {
        name: name.trim(),
        capacity: Number(capacity),
        is_available: isAvailable,
      };

      if (editId) await updateTableApi(editId, payload);
      else await createTableApi(payload);

      setEditId(null);
      setName("");
      setCapacity(4);
      setIsAvailable(true);
      await load();
    } catch {
      setError("No se pudo guardar table. ¿Token admin?");
    }
  };

  const startEdit = (t: TableType) => {
    setEditId(t.id);
    setName(t.name);
    setCapacity(t.capacity);
    setIsAvailable(t.is_available);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteTableApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar table. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Admin Tables (Privado)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ width: 300 }}
            />
            <TextField
              label="Capacidad"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              sx={{ width: 160 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
              }
              label="Disponible"
            />
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={save}>
              {editId ? "Actualizar" : "Crear"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setEditId(null);
                setName("");
                setCapacity(4);
                setIsAvailable(true);
              }}
            >
              Limpiar
            </Button>
            <Button variant="outlined" onClick={load}>
              Refrescar
            </Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Capacidad</TableCell>
              <TableCell>Disponible</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.id}</TableCell>
                <TableCell>{t.name}</TableCell>
                <TableCell>{t.capacity}</TableCell>
                <TableCell>{t.is_available ? "Sí" : "No"}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(t)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => remove(t.id)}>
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
