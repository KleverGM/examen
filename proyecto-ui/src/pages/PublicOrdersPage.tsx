import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Button,
} from "@mui/material";

import { type Order, listOrdersPublicApi } from "../api/orders.api";

export default function PublicOrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listOrdersPublicApi();
      setItems(data.results);
    } catch {
      setError("No se pudo cargar orders");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Lista de Orders (Público)
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button variant="outlined" onClick={load} sx={{ mb: 2 }}>
          Refrescar
        </Button>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((o) => (
              <TableRow key={o.id}>
                <TableCell>{o.id}</TableCell>
                <TableCell>{o.table_id_name ?? `#${o.table_id}`}</TableCell>
                <TableCell>{o.items_summary}</TableCell>
                <TableCell>${o.total}</TableCell>
                <TableCell>{o.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
