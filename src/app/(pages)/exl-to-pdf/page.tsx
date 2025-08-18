"use client"
import Uploader from '@/views/uploader'
import * as xls from 'xlsx';
import SheetList from '@/views/List'
import { useState } from 'react';
import RenderIf from '@/app/components/RenderIf';
export default function ExlToPdf() {
    const [fileData, setFileData] = useState<Record<string, any> | null>();
    const [file, setFile] = useState<File | null | undefined>()
    const onFileSelect = (file: File | null) => {
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (evt: ProgressEvent<FileReader>) => {
            const result = evt.target?.result;
            if (!result) return;

            const data = new Uint8Array(result as ArrayBuffer);
            const workbook = xls.read(data, { type: 'array' });
            const jsonData: any = {};
            workbook.SheetNames.forEach((sheetName) => {
                const worksheet = workbook.Sheets[sheetName];
                const json = xls.utils.sheet_to_json(worksheet, { defval: '' });
                jsonData[sheetName] = json
            });
            setFileData(jsonData)
            debugger
        };

        reader.readAsArrayBuffer(file);
        setFile(file)
    }

    const reset = () => {
        setFile(null);
        setFileData(null)
    }

    return <>
        <RenderIf condition={!file}>
            <Uploader onFileSelect={onFileSelect} />
        </RenderIf>
        <RenderIf condition={!!file}>
            <button
                onClick={() => reset()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700 mt-2">
                New
            </button>
            < SheetList data={fileData ?? {}} file={file as File} />
        </RenderIf>

    </>
}