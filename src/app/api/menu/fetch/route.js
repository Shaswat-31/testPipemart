import mysql from 'mysql2/promise';
import { NextResponse } from 'next/server';

const connectionConfig = {
  host: 'server36.secureclouddns.net',
  user: 'tpmsecure_wp451',
  password: 'p)2SBA1G[1',
  database: 'tpmsecure_wp451',
};

export async function GET(req) {
  try {
    const connection = await mysql.createConnection(connectionConfig);

    // Fetch menus with the taxonomy 'nav_menu'
    const [menus] = await connection.execute(
      'SELECT term_id FROM wpmd_term_taxonomy WHERE taxonomy = ?',
      ['nav_menu'] // Match the database value
    );

    // Extract term_id values
    const menuIds = menus.map((menu) => menu.term_id);

    // If no menuIds found, return an empty object
    if (menuIds.length === 0) {
      await connection.end();
      return NextResponse.json({});
    }

    // Fetch name and slug for each term_id in menuIds
    const [terms] = await connection.execute(
      `SELECT name, slug FROM wpmd_terms WHERE term_id IN (${menuIds.map(() => '?').join(',')})`,
      menuIds
    );

    // Format response as { name: slug }
    const response = terms.reduce((acc, term) => {
        const key = term.name.toLowerCase().replace(/s$/, '').replace(' ', '-');
      acc[key] = term.slug;
      return acc;
    }, {});

    // Close the connection
    await connection.end();

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({
      error: "Some error occurred",
      details: error.message,
    });
  }
}
