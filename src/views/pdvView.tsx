"use client"
import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import jsPDF from "jspdf";
import { autoTable } from 'jspdf-autotable'

function PdfView({ open, setOpen, data, sheetName }: { sheetName: string, data: any[], open: boolean, setOpen: (v: boolean) => void }) {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('xl'));
    const [currentPdfUri, setcurrentPdfUri] = React.useState<string | null>(null);

    const generatePDF = () => {
        debugger
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text(sheetName, 14, 15);
        const headers = [Object.keys(data[0])]
        const rows: string[][] = data.map((obj) => Object.values(obj));
        autoTable(doc, {
            head: headers,
            body: rows,
            startY: 25,
        });
        const pdfBlob = doc.output("blob");
        const url = URL.createObjectURL(pdfBlob);
        setcurrentPdfUri(url);
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {
        open && data?.length && generatePDF()
    }, [open, data]);

    return (
        <React.Fragment>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {sheetName}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>

                        {currentPdfUri && (
                            <iframe
                                src={currentPdfUri}
                                title="Preview"
                                className="w-full  h-[600px] border rounded-lg shadow"
                            />
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}


export default React.memo(PdfView)