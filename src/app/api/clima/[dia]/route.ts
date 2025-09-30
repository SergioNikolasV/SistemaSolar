import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente de Supabase para usar en el servidor
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(
  request: Request,
  { params }: { params: { dia: string } }
) {
  try {
    const dia = parseInt(params.dia, 10);

    if (isNaN(dia)) {
      return NextResponse.json({ error: 'El día debe ser un número.' }, { status: 400 });
    }

    // Consulta clima de un dia
    const { data, error } = await supabase
      .from('dias')
      .select('clima')
      .eq('dia', dia);

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ message: `No se encontraron datos para el día ${dia}.` }, { status: 404 });
    }

    // Devolvemos el resultado
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error en la API:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}