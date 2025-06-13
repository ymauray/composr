// Génération d'un fichiers PDF à partir d'un fichier DOCX'.
// Copyright (C) 2025 Yannick Mauray
//
// Ce programme est un logiciel libre : vous pouvez le redistribuer et/ou le modifier
// selon les termes de la Licence Publique Générale GNU publiée par la Free Software Foundation,
// soit la version 3 de la licence, soit (à votre gré) toute version ultérieure.
//
// Ce programme est distribué dans l'espoir qu'il sera utile,
// mais SANS AUCUNE GARANTIE : sans même la garantie implicite de
// QUALITÉ MARCHANDE ou D'ADÉQUATION À UN USAGE PARTICULIER. Voir la
// Licence Publique Générale GNU pour plus de détails.
//
// Vous devriez avoir reçu une copie de la Licence Publique Générale GNU
// avec ce programme. Si ce n'est pas le cas, voir <https://www.gnu.org/licenses/>.

import { exec } from "child_process";

export async function convertToPdf(inputPath: string): Promise<string> {

    const outputPath = inputPath.replace(/\.docx$/, '.pdf');

    console.log(`Génération de ${outputPath}`);

    const isWindows = process.platform === 'win32';

    if (isWindows)
        return convertToPdfWindows(inputPath, outputPath);
    else
        throw Promise.resolve(outputPath);
}

async function convertToPdfWindows(inputPath: string, outputPath: string): Promise<string> {
    const args = [
        `-InputPath "${inputPath}"`,
        `-OutputPath "${outputPath}"`,
    ];

    const command = `powershell -ExecutionPolicy Bypass -File "./docx2pdf.ps1" ${args.join(' ')}`;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(outputPath);
            }
        });
    });
}