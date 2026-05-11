import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  Appointment,
  AppointmentCreatePayload,
} from "@/types/appointment";

export async function createAppointment(
  payload: AppointmentCreatePayload,
): Promise<Appointment> {
  const { data } = await api.post<ApiResponse<Appointment>>(
    "/appointments",
    payload,
  );
  return data.data;
}
