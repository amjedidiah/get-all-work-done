import { Router } from 'express';
import { postTaxReportValidator } from '../validators/tax-report.validator';
import postTaxReport from '../controllers/tax-report/post';
import getTaxReports from '../controllers/tax-report/get-all';
import getTaxReport from '../controllers/tax-report/get-one';

const router = Router();

router.get('/:id', getTaxReport);
router.get('/', getTaxReports);
router.post('/', postTaxReportValidator, postTaxReport);

export default router;
