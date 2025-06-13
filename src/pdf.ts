import { exec } from "child_process";

export async function convertToPdf(inputPath: string): Promise<string> {

    const outputPath = inputPath.replace(/\.docx$/, '.pdf');

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