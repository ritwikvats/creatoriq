/**
 * Export utilities for analytics data
 */

export interface ExportData {
    type: 'analytics' | 'revenue' | 'content' | 'deals';
    data: any[];
    filename: string;
}

/**
 * Export data as CSV
 */
export function exportAsCSV(exportData: ExportData) {
    const { data, filename } = exportData;

    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        const values = headers.map(header => {
            const value = row[header];
            // Handle nested objects/arrays
            if (typeof value === 'object' && value !== null) {
                return JSON.stringify(value).replace(/"/g, '""');
            }
            // Escape commas and quotes
            const stringValue = String(value || '');
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        });
        csv += values.join(',') + '\n';
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Export data as JSON
 */
export function exportAsJSON(exportData: ExportData) {
    const { data, filename } = exportData;

    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Export analytics as PDF (simplified - uses HTML to PDF conversion)
 */
export function exportAsPDF(exportData: ExportData) {
    const { data, filename, type } = exportData;

    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    // Create HTML content for PDF
    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${filename}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 40px;
                    color: #333;
                }
                h1 {
                    color: #4F46E5;
                    border-bottom: 3px solid #4F46E5;
                    padding-bottom: 10px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th {
                    background-color: #4F46E5;
                    color: white;
                    padding: 12px;
                    text-align: left;
                    font-weight: bold;
                }
                td {
                    padding: 10px;
                    border-bottom: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background-color: #f9fafb;
                }
                .summary {
                    background-color: #EEF2FF;
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    color: #6B7280;
                    font-size: 12px;
                }
            </style>
        </head>
        <body>
            <h1>CreatorIQ - ${filename}</h1>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    `;

    // Add summary based on type
    if (type === 'analytics') {
        const totalFollowers = data.reduce((sum: number, item: any) =>
            sum + (item.metrics?.followers || item.metrics?.subscribers || 0), 0);
        htmlContent += `
            <div class="summary">
                <h3>Summary</h3>
                <p><strong>Total Data Points:</strong> ${data.length}</p>
                <p><strong>Date Range:</strong> ${data[0]?.snapshot_date} to ${data[data.length - 1]?.snapshot_date}</p>
            </div>
        `;
    } else if (type === 'revenue') {
        const totalRevenue = data.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
        const totalTDS = data.reduce((sum: number, item: any) => sum + (item.tds_deducted || 0), 0);
        htmlContent += `
            <div class="summary">
                <h3>Revenue Summary</h3>
                <p><strong>Total Revenue:</strong> ₹${totalRevenue.toLocaleString('en-IN')}</p>
                <p><strong>Total TDS:</strong> ₹${totalTDS.toLocaleString('en-IN')}</p>
                <p><strong>Net Income:</strong> ₹${(totalRevenue - totalTDS).toLocaleString('en-IN')}</p>
            </div>
        `;
    }

    // Add table
    const headers = Object.keys(data[0]);
    htmlContent += `
        <table>
            <thead>
                <tr>
                    ${headers.map(h => `<th>${h.replace(/_/g, ' ').toUpperCase()}</th>`).join('')}
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(row => {
        htmlContent += '<tr>';
        headers.forEach(header => {
            let value = row[header];
            // Format values
            if (typeof value === 'object' && value !== null) {
                value = JSON.stringify(value);
            }
            htmlContent += `<td>${value || '-'}</td>`;
        });
        htmlContent += '</tr>';
    });

    htmlContent += `
            </tbody>
        </table>
        <div class="footer">
            <p>Generated by CreatorIQ - Your Creator Analytics Platform</p>
            <p>For internal use only. Do not share without permission.</p>
        </div>
        </body>
        </html>
    `;

    // Open in new window for print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();

        // Auto-trigger print dialog after content loads
        setTimeout(() => {
            printWindow.print();
        }, 500);
    } else {
        alert('Please allow popups to export as PDF');
    }
}

/**
 * Format data for export based on type
 */
export function formatDataForExport(type: string, rawData: any[]): any[] {
    switch (type) {
        case 'analytics':
            return rawData.map(item => ({
                date: item.snapshot_date,
                platform: item.platform,
                followers: item.metrics?.followers || item.metrics?.subscribers || 0,
                posts: item.metrics?.posts_count || item.metrics?.total_videos || 0,
                engagement_rate: item.metrics?.engagement_rate || item.metrics?.avg_engagement_rate || 0,
            }));

        case 'revenue':
            return rawData.map(item => ({
                date: item.date,
                description: item.description,
                source: item.source,
                amount: item.amount,
                tds_deducted: item.tds_deducted || 0,
                net_income: item.amount - (item.tds_deducted || 0),
            }));

        case 'content':
            return rawData.map(item => ({
                platform: item.platform,
                title: item.title || item.caption || 'Untitled',
                published: item.publishedAt,
                views: item.views || 0,
                likes: item.likes || 0,
                comments: item.comments || 0,
                engagement: item.engagement || 0,
                url: item.url,
            }));

        case 'deals':
            return rawData.map(item => ({
                brand_name: item.brand_name,
                status: item.status,
                amount: item.amount || 0,
                contact_email: item.contact_email || '',
                notes: item.notes || '',
                created_at: item.created_at,
            }));

        default:
            return rawData;
    }
}
