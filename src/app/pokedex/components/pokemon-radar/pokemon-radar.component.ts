import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { LegendComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsCoreOption } from 'echarts/core';
import { STAT_ORDER } from '../../../common/constants/app.constants';
import { Pokemon } from '../../models/pokemon.model';
import { statOf } from '../../utils/stat.util';

echarts.use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer]);

@Component({
  selector: 'app-pokemon-radar',
  standalone: true,
  imports: [NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  template: `
    <div echarts [options]="options()" class="radar" [autoResize]="true"></div>
  `,
  styles: `
    .radar {
      width: 100%;
      height: 260px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonRadarComponent {
  readonly pokemon = input.required<Pokemon>();

  readonly options = computed<EChartsCoreOption>(() => {
    const p = this.pokemon();
    const values = STAT_ORDER.map((name) => statOf(p, name));
    return {
      animationDurationUpdate: 450,
      radar: {
        indicator: [
          { name: 'HP', max: 255 },
          { name: 'Atk', max: 255 },
          { name: 'Def', max: 255 },
          { name: 'SpA', max: 255 },
          { name: 'SpD', max: 255 },
          { name: 'Spe', max: 255 },
        ],
        splitArea: { areaStyle: { color: ['#1a1d1d', '#222626'] } },
        axisName: { color: '#ccc' },
      },
      series: [
        {
          type: 'radar',
          data: [{ value: values, name: p.name }],
          areaStyle: { opacity: 0.35 },
          lineStyle: { width: 2 },
          itemStyle: { color: '#ffb414' },
        },
      ],
    };
  });
}
