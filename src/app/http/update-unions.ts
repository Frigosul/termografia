import { fetchServer } from "@/middlewares/fetch-server";

type DataRequest = {
  unions: {
    id: string;
    name: string;
    firstInstrument: string;
    secondInstrument: string;
    isActive: boolean;
  }[];
};

export async function updateUnions({ unions }: DataRequest) {
  const response = await fetchServer(`/api/instruments/update-unions`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ unions }),
  });

  if (!response.ok) {
    const error = await response.json();
    return Promise.reject({
      status: response.status,
      message: error.message || "Error api",
    });
  }
  const data = await response.json();
  return data;
}
