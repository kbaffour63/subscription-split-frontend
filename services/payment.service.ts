import { instance } from "@/lib/axios";

export type InitializePaymentInput = {
  name: string;
  email: string;
  amount: number;
};

export type InitializePaymentResponse = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
};

export type VerifyPaymentResponse = {
  status: "PENDING" | "SUCCESS" | "FAILED" | "ABANDONED";
  reference: string;
  amount: number;
  channel: string | null;
  paidAt: string | null;
};

export const initializePayment = async (
  payload: InitializePaymentInput,
): Promise<InitializePaymentResponse> => {
  const { data } = await instance.post<InitializePaymentResponse>(
    `/payment`,
    payload,
  );
  return data;
};

export const verifyPayment = async (
  reference: string,
): Promise<VerifyPaymentResponse> => {
  const { data } = await instance.get<VerifyPaymentResponse>(
    `$/payment/verify/${encodeURIComponent(reference)}`,
  );
  return data;
};
