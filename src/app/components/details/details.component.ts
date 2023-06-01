import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import ChartModuleMore from 'highcharts/highcharts-more.js';
import HCSoldGauge from 'highcharts/modules/solid-gauge';
import * as Highcharts from 'highcharts'
import { Game } from 'src/models.';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit, OnDestroy {
  @ViewChild('chart', { static: false }) chartComponent!: any;

  gameRating = 0;
  gameId: string = '';
  game: Game = {
    id: '',
    background_image: '',
    name: '',
    released: '',
    added: '',
    created: '',
    updated: '',
    metacritic: 0,
    metacritic_url: '',
    genres: [],
    parent_platforms: [],
    publishers: [],
    rating: 0,
    website: '',
    description: '',
    ratings: [],
    screenshots: [],
    trailers: []
  };
  routeSub: Subscription = new Subscription();
  gameSub: Subscription = new Subscription();

  BELOW_30_PERCENT_RATING_COLOR = "#ed4655";
  FROM_30_TO_50_PERCENT_RATING_COLOR = "#ffdd38";
  FROM_50_TO_75_PERCENT_RATING_COLOR = "#adfa50";
  OVER_75_PERCENT_RATING_COLOR = "#5cd432";

  colorLimits = [30, 50, 75, 100];
  colors = [
    this.BELOW_30_PERCENT_RATING_COLOR,
    this.FROM_30_TO_50_PERCENT_RATING_COLOR,
    this.FROM_50_TO_75_PERCENT_RATING_COLOR,
    this.OVER_75_PERCENT_RATING_COLOR,
  ];

  highcharts = Highcharts;
  seriesData = this.gameRating;
  plotBands = [
    ...this.colorLimits.map((rateTreshold, index) => (
      {
        from: this.colorLimits[index - 1] || 0,
        to: rateTreshold,
        borderWidth: 0,
        borderColor: '',
        thickness: '40%',
        color: this.colors[index]
      })),
    {
      from: 0,
      to: 0,
      thickness: '15%',
      borderWidth: 5,
      borderColor: 'white',
      color: this.colors[this.colorLimits.indexOf(this.colorLimits.find(limit => 0 <= limit) ?? 0)]
    }
  ];

  gaugeOptions: Highcharts.Options = {
    chart: {
      type: 'solidgauge',
      backgroundColor: {
        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
        stops: [
          [0, 'rgb(200, 255, 255, 0.1)'] as [number, string],
          [1, 'rgb(200, 200, 255, 0.4)'] as [number, string]
        ]
      },
      borderRadius: 10
    },
    title: undefined,
    pane: {
      center: ['50%', '75%'],
      size: '140%',
      startAngle: -90,
      endAngle: 90,
      background: [{
        backgroundColor: Highcharts.defaultOptions.legend?.backgroundColor || '#000',
        innerRadius: '80%',
        outerRadius: '100%',
        shape: 'arc'
      } as Highcharts.PaneBackgroundOptions]
    },
    tooltip: {
      enabled: false
    },
    series: [
      {
        type: "gauge",
        data: [this.game.rating],
      } as Highcharts.SeriesOptionsType
    ],
    yAxis: {
      min: 0,
      max: 100,
      plotBands: this.plotBands,
      stops: [
        [0, '#55BF3B'] as [number, string],
        [0.3, '#DDDF0D'] as [number, string],
        [1, '#DF5353'] as [number, string]
      ],
      lineWidth: 1,
      minorTickInterval: 5,
      tickAmount: 100 / 180,
      title: {
        y: -40
      },
      labels: {
        y: 4,
        distance: 25,
      }
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true
        }
      },
      gauge: {
        dial: {
          radius: '80%',
          borderWidth: 3,
          borderColor: 'orange',
          backgroundColor: this.colors[this.colorLimits.indexOf(this.colorLimits.find(limit => this.seriesData <= limit) ?? 0)],
          baseWidth: 20,
          topWidth: 1,
          baseLength: '3%',
          rearLength: '5%'
        },
        pivot: {
          radius: 10,
          backgroundColor: 'white'
        }
      }
    }
  };

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.routeSub = this.activatedRoute.params.subscribe((params: Params) => {
      this.gameId = params['id'];
      this.getGameDetails(this.gameId);
    });

    ChartModuleMore(Highcharts);
    HCSoldGauge(Highcharts);
  }

  getGameDetails(id: string): void {
    this.gameSub = this.httpService
      .getGame(id).subscribe((gameResponse: Game) => {
        this.game = gameResponse;



        setTimeout(() => {
          this.gameRating = this.game.metacritic;

          console.log(this.gameRating);

          if (this.chartComponent && this.chartComponent.chart) {
            const chart = this.chartComponent.chart;
            const series = chart.series[0];
          
            series.points[0].update(this.gameRating);

            const plotBands = chart.yAxis[0].plotLinesAndBands;
            plotBands[plotBands.length - 1].options.to = this.gameRating;
            plotBands[plotBands.length - 1].options.color = this.colors[
              this.colorLimits.indexOf(this.colorLimits.find(limit => this.gameRating <= limit) ?? 0)
            ];
            
            chart.update({
              pane: {
                background: [{
                  backgroundColor: Highcharts.defaultOptions.legend?.backgroundColor || '#000',
                  innerRadius: '80%',
                  outerRadius: '100%',
                  shape: 'arc'
                }]
              }
            });
          
            chart.redraw();
          }

        }, 50);
      })
  }

  getColor(value: number): string {
    if (value > 75) {
      return this.OVER_75_PERCENT_RATING_COLOR;
    } else if (value > 50) {
      return this.FROM_50_TO_75_PERCENT_RATING_COLOR;
    } else if (value > 30) {
      return this.FROM_30_TO_50_PERCENT_RATING_COLOR;
    } else {
      return this.BELOW_30_PERCENT_RATING_COLOR;
    }
  }

  ngOnDestroy(): void {
    if (this.gameSub) {
      this.gameSub.unsubscribe();
    }
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

}
