import { getCollection } from "astro:content";

/**
 * Obtiene los posts del blog que están publicados, excluyendo los que
 * tienen status "en_progreso" (marcados como draft en Obsidian).
 *
 * @returns Lista de posts publicados, sin ordenar.
 */
export async function getPublishedPosts() {
  const posts = await getCollection("blog");
  return posts.filter((post) => post.data.status !== "en_progreso");
}

/** Velocidad de lectura media (palabras por minuto) */
const WORDS_PER_MINUTE = 200;

/**
 * Estima el tiempo de lectura de un contenido en minutos.
 *
 * @param body Contenido en texto plano o markdown
 * @returns Minutos estimados (mínimo 1)
 */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
