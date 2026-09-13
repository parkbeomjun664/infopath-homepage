'use client';

import { useEffect, useId, useRef } from 'react';
import { useTranslations } from 'next-intl';

import { observeOnce, prefersReducedMotion } from '@/lib/motion';

/**
 * 솔루션 섹션 도입부 — 가로 흐름 다이어그램
 *
 * 설비(다수) → 데이터 수집 → MES → 대시보드(다수)
 * 여러 설비가 하나로 모였다가 다시 여러 화면으로 갈라지는 형태 자체가
 * INFOLINK가 하는 일을 그대로 보여줍니다.
 *
 * 히어로의 장식용 오버레이와 달리 여기서는 라벨이 실제로 읽히는 콘텐츠입니다.
 * 그래서 aria-hidden이 아니라 role="img" + title/desc로 의미를 전달하고,
 * 라벨 문구도 content/messages에서 가져옵니다.
 *
 * SVG를 반응형으로 늘리면 뷰박스 배율에 따라 라벨 크기가 같이 변합니다.
 * 14px을 보장해야 하므로 크기를 고정하고, 좁은 화면에서는 가로 스크롤로 처리합니다.
 */

const NAVY = '#003060';

const W = 1000;
const H = 310;

/** 선·노드 기본 농도. 흰 배경 위라 히어로(0.15)보다 진하게 잡습니다. */
const LINE = 0.5;
const RING = 0.2;
const NODE = 0.55;
const BOX = 0.55;
/** 라벨은 읽혀야 하므로 0.5로는 부족합니다 (흰 배경 대비 약 2.8:1). */
const LABEL = 0.85;

const DRAW_MS = 1200;
const NODE_FADE_MS = 400;
const NODE_STAGGER_MS = 80;

/** 각 단계의 x 좌표 */
const X = { equipment: 90, collect: 350, mes: 590, dashboard: 900 } as const;
/** 설비·대시보드는 3개씩 세로로 벌어집니다 */
const YS = [70, 150, 230] as const;
const MID = 150;
const LABEL_Y = 288;

function Node({ x, y, r = 6, order }: { x: number; y: number; r?: number; order: number }) {
  return (
    <g className="flow-node" data-order={order}>
      <circle cx={x} cy={y} r={17} stroke={NAVY} strokeOpacity={RING} fill="none" />
      <circle cx={x} cy={y} r={r} fill={NAVY} fillOpacity={NODE} />
    </g>
  );
}

function Label({ x, order, children }: { x: number; order: number; children: string }) {
  return (
    <text
      className="flow-node"
      data-order={order}
      x={x}
      y={LABEL_Y}
      textAnchor="middle"
      fill={NAVY}
      fillOpacity={LABEL}
      fontSize={14}
      fontWeight={500}
      letterSpacing={0.2}
    >
      {children}
    </text>
  );
}

export default function FlowDiagram() {
  const t = useTranslations('solutionFeature.flow');
  const svgRef = useRef<SVGSVGElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path.flow-draw'));
    const nodes = Array.from(svg.querySelectorAll<SVGGraphicsElement>('.flow-node'));

    if (prefersReducedMotion()) return;

    // path마다 길이가 달라 dasharray를 실측합니다.
    // 고정값을 쓰면 짧은 선은 일찍 끝나고 긴 선은 잘려 보입니다.
    for (const path of paths) {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.style.transition = `stroke-dashoffset ${DRAW_MS}ms ease-out`;
    }

    for (const node of nodes) {
      const order = Number(node.dataset.order ?? 0);
      node.style.opacity = '0';
      node.style.transition = `opacity ${NODE_FADE_MS}ms ease-out`;
      node.style.transitionDelay = `${DRAW_MS + order * NODE_STAGGER_MS}ms`;
    }

    const clearWillChange = () => {
      for (const path of paths) path.style.willChange = '';
      for (const node of nodes) node.style.willChange = '';
    };

    let doneTimer = 0;

    const stop = observeOnce(svg, () => {
      for (const path of paths) path.style.willChange = 'stroke-dashoffset';
      for (const node of nodes) node.style.willChange = 'opacity';

      // 초기값이 반영된 다음 프레임에 최종값을 넣어야 전환이 실행됩니다.
      window.requestAnimationFrame(() => {
        for (const path of paths) path.style.strokeDashoffset = '0';
        for (const node of nodes) node.style.opacity = '1';
      });

      doneTimer = window.setTimeout(
        clearWillChange,
        DRAW_MS + nodes.length * NODE_STAGGER_MS + NODE_FADE_MS + 100,
      );
    });

    return () => {
      stop();
      window.clearTimeout(doneTimer);
      clearWillChange();
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width={W}
        height={H}
        fill="none"
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        className="mx-auto block max-w-none"
      >
        <title id={titleId}>{t('title')}</title>
        <desc id={descId}>{t('desc')}</desc>

        <g
          stroke={NAVY}
          strokeOpacity={LINE}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          fill="none"
        >
          {/* 설비 3대 → 데이터 수집 (곡선으로 모읍니다) */}
          <path className="flow-draw" d={`M${X.equipment + 20} ${YS[0]} C200 ${YS[0]} 250 ${MID} ${X.collect - 20} ${MID}`} />
          <path className="flow-draw" d={`M${X.equipment + 20} ${MID} L${X.collect - 20} ${MID}`} />
          <path className="flow-draw" d={`M${X.equipment + 20} ${YS[2]} C200 ${YS[2]} 250 ${MID} ${X.collect - 20} ${MID}`} />

          {/* 데이터 수집 → MES */}
          <path className="flow-draw" d={`M${X.collect + 20} ${MID} L520 ${MID}`} />

          {/* MES 박스 — 사각형도 path로 그려야 드로잉이 적용됩니다 */}
          <path
            className="flow-draw"
            strokeOpacity={BOX}
            d="M530 118 H650 A10 10 0 0 1 660 128 V172 A10 10 0 0 1 650 182 H530 A10 10 0 0 1 520 172 V128 A10 10 0 0 1 530 118 Z"
          />

          {/* MES → 대시보드 3면 */}
          <path className="flow-draw" d={`M660 ${MID} C750 ${MID} 800 ${YS[0]} ${X.dashboard - 20} ${YS[0]}`} />
          <path className="flow-draw" d={`M660 ${MID} L${X.dashboard - 20} ${MID}`} />
          <path className="flow-draw" d={`M660 ${MID} C750 ${MID} 800 ${YS[2]} ${X.dashboard - 20} ${YS[2]}`} />

          {/* 라벨 위 기준선 */}
          <path className="flow-draw" strokeOpacity={0.12} d={`M40 264 L${W - 40} 264`} />
        </g>

        {/* 설비 */}
        <Node x={X.equipment} y={YS[0]} order={0} />
        <Node x={X.equipment} y={YS[1]} order={1} />
        <Node x={X.equipment} y={YS[2]} order={2} />

        {/* 데이터 수집 */}
        <Node x={X.collect} y={MID} r={7} order={3} />

        {/* MES — 박스 안 중심점 */}
        <g className="flow-node" data-order={4}>
          <circle cx={X.mes} cy={MID} r={6} fill={NAVY} fillOpacity={BOX} />
        </g>

        {/* 대시보드 */}
        <Node x={X.dashboard} y={YS[0]} order={5} />
        <Node x={X.dashboard} y={YS[1]} order={6} />
        <Node x={X.dashboard} y={YS[2]} order={7} />

        <Label x={X.equipment} order={0}>{t('equipment')}</Label>
        <Label x={X.collect} order={3}>{t('collect')}</Label>
        <Label x={X.mes} order={4}>{t('mes')}</Label>
        <Label x={X.dashboard} order={7}>{t('dashboard')}</Label>
      </svg>
    </div>
  );
}
