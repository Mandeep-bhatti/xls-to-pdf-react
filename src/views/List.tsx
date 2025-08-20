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
import RenderIf from '@/components/RenderIf';
import { Button } from '@mui/material';

function getFilename(filename: string): string {
    return filename.replace(/\.[^/.]+$/, "");
}

type SheetListProps = { reset?: () => void, file?: File, data: Record<string, any[]>, onSelectSheet?: (s: string[]) => void }
export default function SheetList({ data, onSelectSheet, file, reset }: SheetListProps) {
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

        onSelectSheet && onSelectSheet(currentList);

        if (currentList.length === sheets.length) {
            setAllSelected(true)
        } else {
            setAllSelected(false)
        }

    }

    const openPreview = (cp: string) => {
        setCurrentSheet(cp)
        setOpen(true)
    }


    const generatePDF = () => {
        const doc = new jsPDF();

        selected.forEach((sheet, indx) => {
            if (indx > 0) doc.addPage();

            if (Object.keys(data[sheet][0]).length >= 10) {
                doc.setFontSize(12);
            } else {
                doc.setFontSize(16);
            }

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
                    <span className='pr-2'>Sheets: </span>
                    <Checkbox
                        value={isAllSelected}
                        checked={isAllSelected}
                        onChange={() => toggleAllSelect(!isAllSelected)}
                        edge="start"
                        tabIndex={-1}
                        disableRipple
                    />
                </h2>
                <div>
                    <RenderIf condition={!!reset}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => reset && reset()}
                            sx={{ mx: 1 }}
                        >
                            New
                        </Button>
                    </RenderIf>

                    <RenderIf condition={selected.length > 0}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => generatePDF()}
                        >
                            Download
                        </Button>
                    </RenderIf>
                </div>

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
