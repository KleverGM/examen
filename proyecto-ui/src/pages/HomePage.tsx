import { Container, Paper, Typography, Stack } from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";

export default function HomePage() {
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
          <RestaurantIcon />
          <Typography variant="h5">Restaurant Management UI</Typography>
        </Stack>

        <Typography variant="body1" sx={{ mb: 2 }}>
          SPA React + TypeScript + MUI + Router. Consume la API de gestión de
          restaurant (DRF paginado).
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Flujo: Lista (público) → Login → Admin (Panel) → CRUD Tables / Orders.
        </Typography>
      </Paper>
    </Container>
  );
}
