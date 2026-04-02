import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportService } from './report.service';
import { AuthGuard } from '../guards/auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) { }

    @Get('summary')
    @ApiOperation({ summary: 'Download borrowing summary report' })
    @ApiResponse({ status: 200, description: 'Returns a CSV file' })
    async exportSummary(@Res() res: Response) {
        const csv = await this.reportService.getSummary();
        this.sendCsv(res, csv, 'summary.csv');
    }

    @Get('overdue-last-month')
    @ApiOperation({ summary: 'Download overdue borrows from last month' })
    @ApiResponse({ status: 200, description: 'Returns a CSV file' })
    async exportOverdueLastMonth(@Res() res: Response) {
        const csv = await this.reportService.getOverdueLastMonth();
        this.sendCsv(res, csv, 'overdue-last-month.csv');
    }

    @Get('borrowings-last-month')
    @ApiOperation({ summary: 'Download all borrowings from last month' })
    @ApiResponse({ status: 200, description: 'Returns a CSV file' })
    async exportBorrowingsLastMonth(@Res() res: Response) {
        const csv = await this.reportService.getBorrowingsLastMonth();
        this.sendCsv(res, csv, 'borrowings-last-month.csv');
    }

    // download the data in csv sheet whenever hitted from the browser
    private sendCsv(res: Response, data: string, filename: string) {
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(data);
    }
}
