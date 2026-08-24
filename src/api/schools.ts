import api from "./client";

export interface PublicSchool {
  id: string;
  name: string;
  slug: string;
}

export async function getPublicSchoolBySlug(slug: string): Promise<PublicSchool> {
  const { data } = await api.get<PublicSchool>(`/schools/public/${slug}`);
  return data;
}