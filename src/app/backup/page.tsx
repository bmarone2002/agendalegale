"use client";

import { useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  AlertTriangle,
  Archive,
  CheckCircle2,
  Download,
  FileJson,
  Loader2,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

export default function BackupPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [confirmOverwrite, setConfirmOverwrite] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleDownloadBackup() {
    setMessage(null);
    setIsDownloading(true);
    try {
      const res = await fetch("/api/backup", {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error("Risposta non valida dal server");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = disposition.match(/filename=\"?([^\";]+)\"?/i);
      const filename = match?.[1] ?? "backup-calendario.json";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      setMessage({
        type: "success",
        text: "Backup scaricato correttamente sul tuo computer.",
      });
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Non è stato possibile generare il backup. Riprova più tardi.",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleRestore(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const fileInput = fileInputRef.current;
    const file = fileInput?.files?.[0];

    if (!file) {
      setMessage({
        type: "error",
        text: "Seleziona prima un file di backup JSON.",
      });
      return;
    }

    if (!confirmOverwrite) {
      setMessage({
        type: "error",
        text: "Devi confermare di voler sovrascrivere completamente il calendario.",
      });
      return;
    }

    const ok = window.confirm(
      "Questa operazione sovrascriverà completamente il tuo calendario attuale con i dati presenti nel file di backup selezionato. Vuoi procedere?"
    );
    if (!ok) {
      return;
    }

    setIsRestoring(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/backup/restore", {
        method: "POST",
        body: formData,
      });

      const json = (await res.json()) as { success?: boolean; error?: string; importedEvents?: number };

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Errore durante il ripristino del backup.");
      }

      setMessage({
        type: "success",
        text: `Backup ripristinato con successo. Eventi importati: ${json.importedEvents ?? 0}.`,
      });
      setConfirmOverwrite(false);
      setSelectedFileName(null);
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Non è stato possibile ripristinare il backup. Riprova più tardi.",
      });
    } finally {
      setIsRestoring(false);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setSelectedFileName(file ? file.name : null);
    setMessage(null);
  }

  const canRestore = !!selectedFileName && confirmOverwrite && !isRestoring;

  return (
    <AppShell headerTitle={<span>Backup</span>}>
      <SignedIn>
        <div className="mx-auto w-full min-w-0 max-w-3xl space-y-6 overflow-x-hidden pb-6 sm:space-y-8 sm:pb-8">
          <header className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--navy)]/10 text-[var(--navy)]">
              <Archive className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <h1 className="text-xl font-semibold tracking-tight text-[var(--navy)] sm:text-2xl">
                Backup del calendario
              </h1>
              <p className="text-sm leading-relaxed text-zinc-600">
                Salva una copia JSON sul computer e ripristinala quando serve. Il file include eventi e
                sottoeventi presenti nell&apos;account al momento del download.
              </p>
            </div>
          </header>

          {message && (
            <div
              role="status"
              className={`flex gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-red-200 bg-red-50 text-red-900"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
              ) : (
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
              )}
              <p className="min-w-0 break-words">{message.text}</p>
            </div>
          )}

          <section
            className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm sm:p-6"
            aria-labelledby="backup-download-heading"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-2 text-[var(--navy)]">
                  <Download className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <h2 id="backup-download-heading" className="text-base font-semibold sm:text-lg">
                    Scarica backup
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-zinc-600">
                  Ottieni un file <span className="font-medium text-zinc-800">.json</span> con lo stato attuale
                  del calendario. Conservalo in un posto sicuro.
                </p>
              </div>
              <Button
                type="button"
                onClick={handleDownloadBackup}
                disabled={isDownloading}
                className="h-11 min-h-[44px] w-full shrink-0 gap-2 bg-[var(--navy)] text-white hover:bg-[var(--navy-light)] touch-manipulation disabled:opacity-100 sm:h-10 sm:min-h-0 sm:w-auto sm:px-5"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Generazione…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" aria-hidden />
                    Scarica backup (JSON)
                  </>
                )}
              </Button>
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
              <FileJson className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
              <span>
                Per aggiornare il backup, scarica di nuovo dopo le modifiche: ogni download riflette i dati in
                quel momento.
              </span>
            </p>
          </section>

          <section
            className="rounded-2xl border border-zinc-200/90 bg-white p-4 shadow-sm sm:p-6"
            aria-labelledby="backup-restore-heading"
          >
            <div className="mb-4 flex items-center gap-2 text-[var(--navy)]">
              <RotateCcw className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
              <h2 id="backup-restore-heading" className="text-base font-semibold sm:text-lg">
                Ripristina da backup
              </h2>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-zinc-600">
              Carica un file JSON precedentemente scaricato da questo account per ripristinare eventi e
              sottoeventi.
            </p>

            <div
              className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50/90 px-3 py-3 sm:px-4"
              role="alert"
            >
              <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden />
              <div className="min-w-0 text-sm leading-relaxed text-red-950">
                <p className="font-semibold text-red-900">Operazione irreversibile</p>
                <p className="mt-1 text-red-900/90">
                  Il ripristino <strong>sostituisce tutto</strong> il calendario attuale con il contenuto del
                  file. Gli eventi presenti ora verranno persi se non sono nel backup.
                </p>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleRestore}>
              <div className="space-y-2">
                <Label htmlFor="backup-file-input" className="text-sm font-medium text-zinc-800">
                  File di backup (JSON)
                </Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <input
                    ref={fileInputRef}
                    id="backup-file-input"
                    type="file"
                    name="backupFile"
                    accept="application/json,.json"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 min-h-[44px] w-full touch-manipulation sm:h-10 sm:min-h-0 sm:w-auto"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileJson className="h-4 w-4" aria-hidden />
                    Scegli file…
                  </Button>
                  <p className="min-w-0 flex-1 truncate text-sm text-zinc-600" title={selectedFileName ?? undefined}>
                    {selectedFileName ? (
                      <>
                        <span className="text-zinc-500">Selezionato: </span>
                        <span className="font-medium text-zinc-900">{selectedFileName}</span>
                      </>
                    ) : (
                      <span className="text-zinc-400">Nessun file selezionato</span>
                    )}
                  </p>
                </div>
                <p className="text-xs leading-relaxed text-zinc-500">
                  Usa solo file generati da questo servizio. Non caricare JSON di origine sconosciuta.
                </p>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-zinc-50/80 p-3">
                <Checkbox
                  id="confirm-overwrite"
                  checked={confirmOverwrite}
                  onCheckedChange={(v) => {
                    setConfirmOverwrite(Boolean(v));
                    setMessage(null);
                  }}
                  className="mt-0.5"
                />
                <Label htmlFor="confirm-overwrite" className="cursor-pointer text-sm font-normal leading-snug text-zinc-700">
                  Confermo di voler <strong className="font-semibold text-zinc-900">sovrascrivere</strong> il
                  calendario attuale con i dati del file di backup.
                </Label>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={!canRestore}
                  className="h-11 min-h-[44px] w-full gap-2 touch-manipulation sm:h-10 sm:min-h-0 sm:w-auto sm:max-w-xs disabled:bg-zinc-200 disabled:text-zinc-500 disabled:opacity-100"
                >
                  {isRestoring ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                      Ripristino in corso…
                    </>
                  ) : (
                    <>
                      <RotateCcw className="h-4 w-4" aria-hidden />
                      Ripristina calendario
                    </>
                  )}
                </Button>
                {!canRestore && !isRestoring && (
                  <p className="text-xs text-zinc-500">
                    Seleziona un file JSON e spunta la conferma per abilitare il ripristino.
                  </p>
                )}
              </div>

              <details className="group rounded-xl border border-zinc-200 bg-zinc-50/60 text-sm">
                <summary className="cursor-pointer list-none px-3 py-2.5 font-medium text-zinc-700 outline-none marker:hidden [&::-webkit-details-marker]:hidden sm:px-4 sm:py-3">
                  <span className="flex items-center justify-between gap-2">
                    Come procedere (passi rapidi)
                    <span className="text-xs font-normal text-zinc-400 group-open:hidden">Mostra</span>
                    <span className="hidden text-xs font-normal text-zinc-400 group-open:inline">Nascondi</span>
                  </span>
                </summary>
                <ol className="space-y-2 border-t border-zinc-200 px-3 pb-3 pt-2 text-xs leading-relaxed text-zinc-600 sm:px-4 sm:pb-4">
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-800">1.</span>
                    <span>Tocca &quot;Scegli file&quot; e seleziona il backup <code className="rounded bg-white px-1 py-0.5 text-[11px]">.json</code>.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-800">2.</span>
                    <span>Controlla sul computer che sia il backup giusto (data e nome file).</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-800">3.</span>
                    <span>Spunta la casella di conferma sulla sovrascrittura.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-zinc-800">4.</span>
                    <span>Premi &quot;Ripristina calendario&quot; e conferma nel popup. Attendi il messaggio di esito.</span>
                  </li>
                </ol>
              </details>
            </form>
          </section>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="mx-auto w-full min-w-0 max-w-xl rounded-2xl border border-zinc-200 bg-white p-5 text-center shadow-sm sm:p-8">
          <h2 className="mb-2 text-lg font-semibold text-[var(--navy)]">Accedi per gestire i backup</h2>
          <p className="mb-6 text-sm leading-relaxed text-zinc-600">
            Crea un account o accedi per salvare e ripristinare il calendario.
          </p>
          <SignInButton mode="redirect">
            <button
              type="button"
              className="mx-auto min-h-11 w-full max-w-xs rounded-lg bg-[var(--navy)] px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--navy-light)] touch-manipulation sm:w-auto sm:min-h-10 sm:py-2.5"
            >
              Vai al login
            </button>
          </SignInButton>
        </div>
      </SignedOut>
    </AppShell>
  );
}
