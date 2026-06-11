import { Activity, Bluetooth, HeartPulse, LineChart, Moon, Scale, Watch } from "lucide-react";
import type { FitnessInsight, FitnessSample } from "../types/domain";
import { medicationAdherenceCorrelation } from "../services/fitnessInsightsService";
import { Badge } from "./Badge";

interface FitnessInsightsProps {
  samples: FitnessSample[];
  insights: FitnessInsight[];
  adherenceRate: number;
}

const metricIcons: Record<string, JSX.Element> = {
  Steps: <Activity size={18} />,
  Sleep: <Moon size={18} />,
  "Resting heart rate": <HeartPulse size={18} />,
  "Active minutes": <LineChart size={18} />,
  "Blood pressure": <HeartPulse size={18} />,
  "Blood glucose": <Scale size={18} />,
};

export function FitnessInsights({ samples, insights, adherenceRate }: FitnessInsightsProps) {
  const latest = samples.at(-1);
  const correlation = medicationAdherenceCorrelation(adherenceRate, insights);

  return (
    <div className="view-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Fitness tracker insights</p>
          <h2>Demo-mode wearable integration for daily care-plan context.</h2>
          <p>
            Simulated Fitbit, Apple Health, and Google Fit connectors show trends without OAuth.
            Wellness suggestions stay non-medical and clinician-confirmed.
          </p>
        </div>
        <div className="connector-card">
          <Watch size={24} />
          <div>
            <strong>Connect Fitness Tracker</strong>
            <p>Demo mode connected · OAuth not required</p>
          </div>
          <Badge tone="green">
            <Bluetooth size={14} /> Live demo
          </Badge>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card metric-success">
          <div className="metric-icon"><Activity /></div>
          <div>
            <p className="eyebrow">Steps</p>
            <strong>{latest?.steps.toLocaleString() ?? "N/A"}</strong>
            <span>today</span>
          </div>
        </article>
        <article className="metric-card metric-calm">
          <div className="metric-icon"><HeartPulse /></div>
          <div>
            <p className="eyebrow">Resting HR</p>
            <strong>{latest?.restingHeartRate ?? "N/A"}</strong>
            <span>bpm</span>
          </div>
        </article>
        <article className="metric-card metric-warn">
          <div className="metric-icon"><Moon /></div>
          <div>
            <p className="eyebrow">Sleep</p>
            <strong>{latest ? `${latest.sleepHours}h` : "N/A"}</strong>
            <span>last night</span>
          </div>
        </article>
        <article className="metric-card metric-calm">
          <div className="metric-icon"><Scale /></div>
          <div>
            <p className="eyebrow">Weight</p>
            <strong>{latest ? `${latest.weightLbs} lb` : "N/A"}</strong>
            <span>synthetic reading</span>
          </div>
        </article>
      </section>

      <section className="fitness-layout">
        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Daily report</p>
              <h3>Trend vs. 7-day average</h3>
            </div>
            <Badge tone="neutral">30 days of data</Badge>
          </div>
          <div className="insight-cards">
            {insights.map((insight) => (
              <div key={insight.metric} className="insight-card">
                <div className="insight-icon">{metricIcons[insight.metric] ?? <LineChart size={18} />}</div>
                <div>
                  <strong>{insight.metric}</strong>
                  <span>{insight.value}</span>
                  <p>{insight.trend}</p>
                  <small>{insight.explanation}</small>
                </div>
                <Badge tone={insight.status}>{insight.status}</Badge>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">30-day view</p>
              <h3>Steps and sleep</h3>
            </div>
            <LineChart size={19} />
          </div>
          <div className="chart-list" aria-label="Thirty day synthetic steps chart">
            {samples.map((sample) => (
              <div key={sample.date} title={`${sample.date}: ${sample.steps} steps, ${sample.sleepHours}h sleep`}>
                <span style={{ height: `${Math.max(10, sample.steps / 120)}px` }}></span>
              </div>
            ))}
          </div>
          <div className="sleep-line">
            {samples.slice(-7).map((sample) => (
              <span key={sample.date}>
                <strong>{sample.sleepHours}h</strong>
                <small>{new Date(`${sample.date}T00:00:00`).toLocaleDateString([], { weekday: "short" })}</small>
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="panel full-width-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Medication adherence correlation</p>
            <h3>Care-plan relevance</h3>
          </div>
          <Badge tone="neutral">Non-causal</Badge>
        </div>
        <p className="translation-lead">{correlation}</p>
        <div className="safety-box">
          <p>Consider asking your clinician whether your activity, sleep, blood pressure, or glucose targets are appropriate.</p>
          <p>MedDcode does not infer diagnoses from wearable trends.</p>
        </div>
      </section>
    </div>
  );
}
