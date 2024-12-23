import puppeteer from 'puppeteer';

// Named export for POST method
export async function POST(req, res) {
    if (req.method === 'POST') {
      try {
        // URL to scrape
        const url = 'https://www.pipingmart.ae/alloy-steel-pipe/';
  
        // Launch Puppeteer browser
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
  
        // Navigate to the URL
        await page.goto(url, { waitUntil: 'networkidle2' });
  
        // Extract table data using Puppeteer's evaluate method
        const tablesData = await page.evaluate(() => {
            const tables = document.querySelectorAll('table'); // Find all tables
            let extractedData = [];
          
            tables.forEach((table, index) => {
              let rows = table.querySelectorAll('tr');
              let tableData = [];
          
              rows.forEach((row) => {
                let rowData = [];
                const cells = row.querySelectorAll('th, td');
          
                // Filter out rows where there are no cells or they are empty
                if (cells.length > 0 && !Array.from(cells).every(cell => cell.innerText.trim() === '')) {
                  cells.forEach((cell) => {
                    rowData.push(cell.innerText.trim());
                  });
                  tableData.push(rowData);
                }
              });
          
              if (tableData.length > 0) {
                extractedData.push({ tableIndex: index + 1, rows: tableData });
              }
            });
          
            return extractedData;
          });
          
  
        // Close the browser
        await browser.close();
  
        // Return the response
        return new Response(
          JSON.stringify({ success: true, tables: tablesData }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error(error);
        return new Response(
          JSON.stringify({ success: false, message: 'Error scraping data' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // If method is not POST, return error
      return new Response(
        JSON.stringify({ success: false, message: `Method ${req.method} Not Allowed` }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  
