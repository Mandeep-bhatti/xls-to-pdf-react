"use client"
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useState } from 'react';
import PdvView from './pdvView';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable'
import RenderIf from '@/app/components/RenderIf';
function getFilename(filename: string): string {
    return filename.replace(/\.[^/.]+$/, "");
}
export default function SheetList({ data, onSelectSheet, file }: { file?: File, data: Record<string, any[]>, onSelectSheet?: (s: string[]) => void }) {
    const [selected, setSelected] = useState<string[]>([]);
    const [currentSheet, setCurrentSheet] = useState("");
    const [open, setOpen] = useState(false);
    const [isAllSelected, setAllSelected] = useState(false)
    const sheets = Object.keys(data);

    const onCheckHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        ;

        let currentList = [];

        if (selected.includes(e.target.value)) {
            currentList = selected.filter((sheet) => sheet != e.target.value)
        } else {
            currentList = [...selected, e.target.value]
        }

        setSelected(currentList);

        onSelectSheet && onSelectSheet(currentList)

    }

    const openPreview = (cp: string) => {
        setCurrentSheet(cp)
        setOpen(true)
    }


    const generatePDF = () => {
        const doc = new jsPDF();

        selected.forEach((sheet, indx) => {
            if (indx > 0) doc.addPage();

            doc.setFontSize(16);
            doc.text(`Sheet: ${sheet}`, 14, 15);

            const headers = [Object.keys(data[sheet][0])];
            const rows = data[sheet].map((obj) =>
                Object.values(obj).map((v) => String(v))
            );

            autoTable(doc, {
                head: headers,
                body: rows,
                startY: 25,
            });
        });
        doc.save(getFilename(file?.name || "") + "_export.pdf")
    };

    const toggleAllSelect = (isAll: boolean) => {
        if (isAll) {
            setSelected(Object.keys(data))
        } else {
            setSelected([])
        };
        setAllSelected(isAll)
    }
    return (
        <>
            <PdvView open={open} setOpen={setOpen} data={data[currentSheet]} sheetName={currentSheet} />
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800">
                    Sheets:
                    <Checkbox
                        value={isAllSelected}
                        checked={isAllSelected}
                        onChange={() => toggleAllSelect(!isAllSelected)}
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                    />
                </h2>
                <RenderIf condition={selected.length > 0}>
                    <button
                        onClick={() => generatePDF()}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">
                        Download
                    </button>
                </RenderIf>
            </div>
            <List sx={{ width: '100%', maxWidth: 700, bgcolor: 'background.paper' }}>
                {sheets.map((sheet) => {
                    const labelId = `checkbox-list-label-${sheet}`;

                    return (
                        <ListItem
                            key={sheet}
                            disablePadding
                        >
                            <ListItemButton role={undefined} dense >
                                <ListItemIcon>
                                    <Checkbox
                                        value={sheet}
                                        checked={selected.includes(sheet)}
                                        onChange={onCheckHandler}
                                        edge="start"
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${sheet}`} onClick={() => openPreview(sheet)} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
}
