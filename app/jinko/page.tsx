import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Animal } from "@/lib/jinko/engine/types";
import animalsData from "@/lib/jinko/data/animals.json";
import questionsData from "@/lib/jinko/data/questions.json";

export default function JinkoPage() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState<"pt" | "en">("pt");

  useEffect(() => {
    setLang(i18n.language.startsWith("en") ? "en" : "pt");
  }, [i18n.language]);

  const translateProp = (prop: any) => {
    if (!prop) return "";
    return prop[lang] || prop.pt || "";
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "mammal" | "bird" | "reptile" | "insect" | "other"
  >("all");
  const [sortField, setSortField] = useState<"name" | "playCount">("playCount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showLegend, setShowLegend] = useState(false);
  const [activeTab, setActiveTab] = useState<"table" | "simulator">("table");
  const [simAnswers, setSimAnswers] = useState<Record<string, number>>({});

  const sortedQuestions = useMemo(() => {
    return [...questionsData].sort((a, b) => {
      const aNum = parseInt(a.id.replace(/\D/g, ""), 10);
      const bNum = parseInt(b.id.replace(/\D/g, ""), 10);
      return aNum - bNum;
    });
  }, []);

  const simResults = useMemo(() => {
    const scoredList = (animalsData as Animal[]).map((animal) => {
      let score = 0;
      for (const [qId, weight] of Object.entries(animal.answers)) {
        const userValue = simAnswers[qId] ?? 0;
        if (userValue !== 0) {
          const strength = Math.abs(userValue);
          const multiplier = strength >= 1 ? 3 : strength >= 0.5 ? 1.5 : 0;
          score += userValue * weight * multiplier;
        }
      }
      return { ...animal, score };
    });

    scoredList.sort((a, b) => {
      const scoreDiff = b.score - a.score;
      if (scoreDiff !== 0) return scoreDiff;
      return b.playCount - a.playCount;
    });

    return scoredList;
  }, [simAnswers]);

  const getCategory = (animal: Animal) => {
    if (animal.answers["q1"] === 1) return "mammal";
    if (animal.answers["q2"] === 1) return "bird";
    if (animal.answers["q3"] === 1) return "reptile";
    if (animal.answers["q4"] === 1) return "insect";
    return "other";
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "mammal":
        return lang === "pt" ? "Mamífero" : "Mammal";
      case "bird":
        return lang === "pt" ? "Ave" : "Bird";
      case "reptile":
        return lang === "pt" ? "Réptil/Anfíbio" : "Reptile/Amphibian";
      case "insect":
        return lang === "pt" ? "Inseto/Aracnídeo" : "Insect/Arachnid";
      default:
        return lang === "pt" ? "Outros" : "Others";
    }
  };

  const getCategoryColorClass = (category: string) => {
    switch (category) {
      case "mammal":
        return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
      case "bird":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      case "reptile":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "insect":
        return "bg-purple-500/10 text-purple-500 border border-purple-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
    }
  };

  const processedAnimals = useMemo(() => {
    let result = [...(animalsData as Animal[])];

    const search = searchTerm.toLowerCase().trim();
    if (search) {
      result = result.filter((animal) =>
        translateProp(animal.name).toLowerCase().includes(search),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (animal) => getCategory(animal) === selectedCategory,
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === "name") {
        const nameA = translateProp(a.name);
        const nameB = translateProp(b.name);
        comparison = nameA.localeCompare(
          nameB,
          lang === "pt" ? "pt-BR" : "en-US",
        );
      } else {
        comparison = a.playCount - b.playCount;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [searchTerm, selectedCategory, sortField, sortOrder, lang]);

  const handleSort = (field: "name" | "playCount") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const renderIndicator = (value: number) => {
    if (value >= 1) {
      return (
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-500 text-sm font-semibold shadow-sm select-none"
          title="Sim"
        >
          ✓
        </span>
      );
    }
    if (value <= -1) {
      return (
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500/15 text-rose-500 text-sm font-semibold shadow-sm select-none"
          title="Não"
        >
          ✕
        </span>
      );
    }
    if (value === 0.5 || value === -0.5) {
      return (
        <span
          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/15 text-amber-500 text-sm font-semibold shadow-sm select-none"
          title="Parcial / Às vezes"
        >
          ~
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center justify-center w-6 h-6 text-muted-foreground/40 font-light select-none"
        title="Neutro / Irrelevante"
      >
        —
      </span>
    );
  };

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#0a0a0a] text-zinc-100 animate-in fade-in p-6">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 pl-14 lg:pl-0">
      
          <div className="text-left">
            <h2 className="text-4xl font-semibold text-red-300/90">
              {lang === "pt" ? "Banco de Animais" : "Animals Database"}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              {lang === "pt"
                ? "Explore os animais catalogados e veja as respostas que o Jinko conhece."
                : "Explore cataloged animals and view known Jinko answers."}
            </p>
          </div>
        </div>

        <div className="flex border-b border-white/10 mb-2">
          <button
            onClick={() => setActiveTab("table")}
            className={`px-6 py-3 font-semibold text-sm transition-all relative ${
              activeTab === "table"
                ? "text-red-300/90"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {lang === "pt" ? "Tabela de Animais" : "Animals Table"}
            {activeTab === "table" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400/80"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("simulator")}
            className={`px-6 py-3 font-semibold text-sm transition-all relative flex items-center gap-2 ${
              activeTab === "simulator"
                ? "text-red-300/90"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            {lang === "pt"
              ? "Simulador em Tempo Real (Debug)"
              : "Real-time Simulator (Debug)"}
            {activeTab === "simulator" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400/80"></div>
            )}
          </button>
        </div>

        {activeTab === "table" && (
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 flex flex-col gap-5 shadow-sm">
            <div className="flex flex-col xl:flex-row gap-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder={
                    lang === "pt"
                      ? "Buscar animal por nome..."
                      : "Search animal by name..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-[#0a0a0a] border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-400/50 focus:border-red-400/50 text-zinc-100 placeholder-zinc-600 transition-all text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    selectedCategory === "all"
                      ? "bg-red-900/40 text-red-200 border-red-500/30"
                      : "border-white/10 bg-[#0a0a0a] text-zinc-400 hover:text-zinc-100 hover:border-white/20"
                  }`}
                >
                  {lang === "pt" ? "Todos" : "All"} ({animalsData.length})
                </button>
                <button
                  onClick={() => setSelectedCategory("mammal")}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    selectedCategory === "mammal"
                      ? "bg-blue-900/40 text-blue-200 border-blue-500/30"
                      : "border-white/10 bg-[#0a0a0a] text-zinc-400 hover:text-zinc-100 hover:border-white/20"
                  }`}
                >
                  {lang === "pt" ? "Mamíferos" : "Mammals"}
                </button>
                <button
                  onClick={() => setSelectedCategory("bird")}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    selectedCategory === "bird"
                      ? "bg-amber-900/40 text-amber-200 border-amber-500/30"
                      : "border-white/10 bg-[#0a0a0a] text-zinc-400 hover:text-zinc-100 hover:border-white/20"
                  }`}
                >
                  {lang === "pt" ? "Aves" : "Birds"}
                </button>
                <button
                  onClick={() => setSelectedCategory("reptile")}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    selectedCategory === "reptile"
                      ? "bg-emerald-900/40 text-emerald-200 border-emerald-500/30"
                      : "border-white/10 bg-[#0a0a0a] text-zinc-400 hover:text-zinc-100 hover:border-white/20"
                  }`}
                >
                  {lang === "pt" ? "Répteis/Anfíbios" : "Reptiles/Amph."}
                </button>
                <button
                  onClick={() => setSelectedCategory("insect")}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    selectedCategory === "insect"
                      ? "bg-purple-900/40 text-purple-200 border-purple-500/30"
                      : "border-white/10 bg-[#0a0a0a] text-zinc-400 hover:text-zinc-100 hover:border-white/20"
                  }`}
                >
                  {lang === "pt" ? "Insetos/Aracnídeos" : "Insects"}
                </button>
                <button
                  onClick={() => setSelectedCategory("other")}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    selectedCategory === "other"
                      ? "bg-zinc-800 text-zinc-200 border-zinc-600"
                      : "border-white/10 bg-[#0a0a0a] text-zinc-400 hover:text-zinc-100 hover:border-white/20"
                  }`}
                >
                  {lang === "pt" ? "Outros" : "Others"}
                </button>
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <button
                onClick={() => setShowLegend(!showLegend)}
                className="flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${showLegend ? "rotate-90" : ""}`}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
                {lang === "pt"
                  ? "VER LEGENDA E PERGUNTAS (Q1 A Q21)"
                  : "VIEW LEGEND AND QUESTIONS"}
              </button>

              {showLegend && (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-x-8 gap-y-1 mt-4 text-xs bg-[#0a0a0a] p-5 rounded-xl border border-white/5">
                  {sortedQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="break-inside-avoid flex gap-2 py-1.5 border-b border-white/5 last:border-b-0"
                    >
                      <span className="font-bold text-red-400/80 min-w-[28px] uppercase">
                        {q.id}:
                      </span>
                      <span className="text-zinc-400">
                        {translateProp(q.text)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "table" && (
          <div className="grid grid-cols-1 w-full">
            <div className="bg-[#111111] border border-white/5 rounded-2xl shadow-sm flex flex-col min-w-0 relative w-full overflow-hidden">
              <div 
                className="overflow-x-auto w-full pt-2 -scale-y-100 [&::-webkit-scrollbar]:!block [&::-webkit-scrollbar]:!h-2.5 [&::-webkit-scrollbar-track]:!bg-[#0a0a0a] [&::-webkit-scrollbar-track]:!rounded-full [&::-webkit-scrollbar-thumb]:!bg-white/20 hover:[&::-webkit-scrollbar-thumb]:!bg-white/30 [&::-webkit-scrollbar-thumb]:!rounded-full" 
                style={{ scrollbarWidth: "auto" }}
              >
                <table className="w-full min-w-max border-collapse text-sm text-left -scale-y-100">
                  <thead>
                    <tr className="bg-[#0a0a0a] border-b border-white/5">
                      <th
                        onClick={() => handleSort("name")}
                        className="sticky left-0 bg-[#0a0a0a] px-5 py-4 font-semibold text-zinc-100 border-r border-white/5 cursor-pointer select-none min-w-[150px] z-20 hover:text-red-400 transition-all"
                      >
                        <div className="flex items-center gap-1.5 text-left">
                          {lang === "pt" ? "Animal" : "Animal"}
                          {sortField === "name" && (
                            <span className="text-xs text-red-500/80">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </div>
                      </th>

                      <th className="px-4 py-4 font-semibold text-zinc-500 min-w-[120px] text-left">
                        {lang === "pt" ? "Grupo" : "Group"}
                      </th>

                      <th
                        onClick={() => handleSort("playCount")}
                        className="px-4 py-4 font-semibold text-zinc-500 cursor-pointer select-none min-w-[110px] hover:text-red-400 transition-all text-left"
                      >
                        <div className="flex items-center gap-1.5 text-left">
                          {lang === "pt" ? "Jogadas" : "Plays"}
                          {sortField === "playCount" && (
                            <span className="text-xs text-red-500/80">
                              {sortOrder === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </div>
                      </th>

                      {sortedQuestions.map((q) => (
                        <th
                          key={q.id}
                          title={translateProp(q.text)}
                          className="px-3 py-4 text-center font-semibold text-zinc-500 min-w-[55px] uppercase relative group cursor-help hover:bg-white/5 transition-all"
                        >
                          {q.id}
                          <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 hidden group-hover:block bg-zinc-900 text-zinc-100 text-[10px] leading-normal p-2 rounded-lg shadow-lg z-50 font-normal normal-case pointer-events-none text-left border border-white/10">
                            <span className="font-bold block text-red-400/80 uppercase mb-0.5">
                              {q.id}:
                            </span>
                            {translateProp(q.text)}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processedAnimals.length === 0 ? (
                      <tr>
                        <td
                          colSpan={sortedQuestions.length + 3}
                          className="text-center py-10 text-zinc-600 text-sm"
                        >
                          {lang === "pt"
                            ? "Nenhum animal encontrado."
                            : "No animals found."}
                        </td>
                      </tr>
                    ) : (
                      processedAnimals.map((animal) => {
                        const category = getCategory(animal);
                        return (
                          <tr
                            key={animal.id}
                            className="border-b border-white/5 hover:bg-[#1a1a1a] last:border-b-0 transition-all text-left"
                          >
                            <td className="sticky left-0 bg-[#111111] font-semibold text-zinc-200 border-r border-white/5 px-5 py-3.5 z-10 min-w-[150px] shadow-[4px_0_8px_-4px_rgba(0,0,0,0.1)] text-left group-hover:bg-[#1a1a1a]">
                              {translateProp(animal.name)}
                            </td>

                            <td className="px-4 py-3.5 text-left">
                              <span
                                className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium tracking-wide ${getCategoryColorClass(
                                  category,
                                )}`}
                              >
                                {getCategoryLabel(category)}
                              </span>
                            </td>

                            <td className="px-4 py-3.5 text-zinc-500 font-medium text-left">
                              {animal.playCount}
                            </td>

                            {sortedQuestions.map((q) => (
                              <td
                                key={q.id}
                                className="px-3 py-3.5 text-center align-middle"
                              >
                                {renderIndicator(animal.answers[q.id] ?? 0)}
                              </td>
                            ))}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "simulator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left pb-10">
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-100">
                      {lang === "pt"
                        ? "Entradas do Simulador"
                        : "Simulator Inputs"}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {lang === "pt"
                        ? "Defina o peso de cada característica para ver a Leaderboard mudando."
                        : "Set the weight of each trait to see the Leaderboard change."}
                    </p>
                  </div>
                  <button
                    onClick={() => setSimAnswers({})}
                    className="px-4 py-2 border border-white/10 hover:bg-white/5 hover:text-red-300 rounded-lg text-xs font-semibold text-zinc-400 transition-all flex items-center gap-1.5"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                      <path d="M16 3h5v5" />
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                      <path d="M8 21H3v-5" />
                    </svg>
                    {lang === "pt" ? "Limpar" : "Clear"}
                  </button>
                </div>

                <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2">
                  {sortedQuestions.map((q) => {
                    const currentVal = simAnswers[q.id] ?? 0;
                    return (
                      <div
                        key={q.id}
                        className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 p-3.5 bg-[#0a0a0a] border border-white/5 rounded-xl transition-all hover:border-white/20"
                      >
                        <div className="text-left">
                          <span className="font-bold text-xs text-red-400/80 uppercase block tracking-wider mb-0.5">
                            {q.id}
                          </span>
                          <span className="text-sm font-medium text-zinc-300">
                            {translateProp(q.text)}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 bg-[#111111] p-1 border border-white/5 rounded-lg self-start xl:self-auto shadow-inner">
                          <button
                            onClick={() =>
                              setSimAnswers({ ...simAnswers, [q.id]: 1 })
                            }
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                              currentVal === 1
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                            }`}
                          >
                            {lang === "pt" ? "Sim" : "Yes"}
                          </button>
                          <button
                            onClick={() =>
                              setSimAnswers({ ...simAnswers, [q.id]: 0.5 })
                            }
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                              currentVal === 0.5
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/20 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                            }`}
                          >
                            {lang === "pt" ? "Talvez" : "Maybe"}
                          </button>
                          <button
                            onClick={() =>
                              setSimAnswers({ ...simAnswers, [q.id]: 0 })
                            }
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                              currentVal === 0
                                ? "bg-zinc-700/50 text-zinc-300 border border-zinc-600/50 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                            }`}
                          >
                            {lang === "pt" ? "N/A" : "N/A"}
                          </button>
                          <button
                            onClick={() =>
                              setSimAnswers({ ...simAnswers, [q.id]: -1 })
                            }
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 ${
                              currentVal === -1
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/20 shadow-sm"
                                : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                            }`}
                          >
                            {lang === "pt" ? "Não" : "No"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 lg:sticky lg:top-6 flex flex-col gap-4">
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-sm flex flex-col">
                <div className="border-b border-white/5 pb-4 mb-4 text-left">
                  <h3 className="text-xl font-semibold text-red-300/90">
                    {lang === "pt" ? "Top Candidatos" : "Top Candidates"}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {lang === "pt"
                      ? "Classificação em tempo real"
                      : "Real-time ranking"}
                  </p>
                </div>

                <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2">
                  {simResults.slice(0, 15).map((animal, index) => {
                    const score = animal.score;
                    const category = getCategory(animal);
                    const rank = index + 1;

                    const getRankBadgeClass = (r: number) => {
                      if (r === 1)
                        return "bg-amber-500/20 text-amber-500 border border-amber-500/30 font-bold scale-105";
                      if (r === 2)
                        return "bg-slate-300/25 text-slate-300 border border-slate-300/30 font-bold";
                      if (r === 3)
                        return "bg-orange-700/20 text-orange-500 border border-orange-700/30 font-bold";
                      return "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20";
                    };

                    return (
                      <div
                        key={animal.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                          rank === 1
                            ? "bg-red-500/5 border-red-500/20 shadow-md shadow-red-500/5"
                            : "bg-[#0a0a0a] border-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold select-none ${getRankBadgeClass(
                              rank,
                            )}`}
                          >
                            {rank}º
                          </span>

                          <div className="text-left">
                            <span
                              className={`font-semibold block ${
                                rank === 1
                                  ? "text-red-300/90 text-base"
                                  : "text-zinc-200 text-sm"
                              }`}
                            >
                              {translateProp(animal.name)}
                            </span>
                            <span
                              className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide mt-0.5 ${getCategoryColorClass(
                                category,
                              )}`}
                            >
                              {getCategoryLabel(category)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end font-mono">
                          <span
                            className={`text-sm font-bold tracking-tight ${
                              score > 0
                                ? "text-emerald-400"
                                : score < 0
                                  ? "text-rose-400"
                                  : "text-zinc-600"
                            }`}
                          >
                            {score > 0
                              ? `+${score.toFixed(1)}`
                              : score.toFixed(1)}{" "}
                            pts
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-0.5 font-sans">
                            {animal.playCount}{" "}
                            {lang === "pt" ? "jogadas" : "plays"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
