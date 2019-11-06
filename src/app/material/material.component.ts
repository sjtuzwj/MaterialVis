import { Component, OnInit } from '@angular/core';
import {prepareBoxplotData} from 'echarts/extension/dataTool';
import { MaterialService } from '../material.service';
import { FileUploader } from 'ng2-file-upload';
import { preserveWhitespacesDefault } from '@angular/compiler';
const COLORS = ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'];
@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {
  optoption1: any;
  optoption2: any;
  id1: number;
  id2: number;
  xrdjson1: number[][];
  xrdjson2: number[][];
  elejson: number[][];
  eleoption: any;
  sroption: any;
  stsoption: any;
  echartsInstance: any;
  ab1: any;
  rf1: any;
  ts1: any;
  ab2: any;
  rf2: any;
  ts2: any;
  ab = true;
  rf = true;
  ts = true;
  libs: string[];
  uploader: FileUploader = new FileUploader({
    url: 'file/upload',
    method: 'POST',
    itemAlias: 'uploadedfile',
    autoUpload: true
  });
      uploadFile(content) {
        this.uploader.uploadAll();
        setTimeout(e => this.getlib(), 1000)
    }
  setid(id) {
    this.service.setid(id);
    this.getchange();
  }
  getlib(){
      this.service.getlib().subscribe(e => this.libs = e.map(ele => ele.id.substr(3)));
  }
  getchange() {
    this.service.getEle().subscribe(ele => {
        this.elejson = ele;
        this.eleInit();
        const inioption = {
            title: {
                text: ' Optical'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: (params) => {
                    const index = params[0].dataIndex;
                    return [
                        'Wavelength: ' + this.xrdjson2[3][index] + 'nm<br/>',
                        'reflectance: ' + this.xrdjson2[0][index] + '<br/>',
                        'transmittance: ' + this.xrdjson2[1][index] + '<br/>',
                        'absorbility: ' + this.xrdjson2[2][index] + '<br/>'
                    ].join('');
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    dataZoom : {}
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '10%',
                containLabel: true
            },
            xAxis : [
                {
                    name: 'wavelen',
                    axisLabel: {
                        formatter: '{value}nm'
                    },
                    type : 'category',
                    boundaryGap : false,
                    data : []
                }
            ],
            yAxis : [
                {
                    name: 'fraction',
                    type : 'value'
                }
            ],
            series : [
                {
                    name: 'absorbility',
                    type: 'line',
                    data: []
                },
                {
                    name: 'reflectance',
                    type: 'line',
                    data: []
                },
                {
                    name: 'transmittance',
                    type: 'line',
                    data: []
                }
            ]
        };
        this.optoption1 = inioption;
        this.optoption2 = inioption;
        });
  }
  onS(event) {
    if (this.id2) {
        if (event.selected.reflectance === false && this.rf === true) {
            this.rf1 = [];
            this.rf2 = [];
            this.rf = false;
            if (this.ab === true && this.ts === true) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v);
              this.ab2 = this.xrdjson2[0].map((v, i) => 1 - v);
              } else if (this.ab === true && this.ts === false) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - this.xrdjson1[1][i]);
              this.ab2 = this.xrdjson2[0].map((v, i) => 1 - this.xrdjson2[1][i]);
              }
        } else if (event.selected.reflectance === false && this.rf === false) {
          this.rf1 = this.xrdjson1[0].map((v, i) => v  + this.xrdjson1[1][i]);
          this.rf2 = this.xrdjson2[0].map((v, i) => v  + this.xrdjson2[1][i]);
          this.rf = true;
          if (this.ab === true && this.ts === true) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1);
              this.ab2 = this.xrdjson2[0].map((v, i) => 1);
            } else if (this.ab === true && this.ts === false) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - this.xrdjson1[1][i]);
              this.ab2 = this.xrdjson2[0].map((v, i) => 1 - this.xrdjson2[1][i]);
            }
        }
        if (event.selected.transmittance === false && this.ts === true) {
          if (this.rf === true) {
              this.ts1 = [];
              this.ts2 = [];
              this.rf1 = this.xrdjson1[0].map((v, i) => v);
              this.rf2 = this.xrdjson2[0].map((v, i) => v);
              if (this.ab === true ) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - this.xrdjson1[1][i]);
              this.ab2 = this.xrdjson2[0].map((v, i) => 1 - this.xrdjson2[1][i]);
              }
          } else if ( this.rf === false) {
              this.ts1 = [];
              this.ts2 = [];
              if (this.ab === true ) {
                  this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v - this.xrdjson1[1][i]);
                  this.ab2 = this.xrdjson2[0].map((v, i) => 1 - v - this.xrdjson2[1][i]);
              }
          }
          this.ts = false;
      } else if (event.selected.transmittance === false && this.ts === false) {
          if (this.rf === true) {
              this.ts1 = this.xrdjson1[1];
              this.ts2 = this.xrdjson2[1];
              this.rf1 = this.xrdjson1[0].map((v, i) => v  + this.xrdjson1[1][i]);
              this.rf2 = this.xrdjson2[0].map((v, i) => v  + this.xrdjson2[1][i]);
              if (this.ab === true ) {
                  this.ab1 = this.xrdjson1[0].map((v, i) => 1);
                  this.ab2 = this.xrdjson2[0].map((v, i) => 1);
              }
          } else if ( this.rf === false) {
              this.ts1 = this.xrdjson1[1];
              this.ts2 = this.xrdjson2[1];
              if (this.ab === true ) {
                  this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v);
                  this.ab2 = this.xrdjson2[0].map((v, i) => 1 - v);
              }
          }
          this.ts = true;
      }
        if (event.selected.absorbility === false && this.ab === false) {
          if (this.ts === false && this.rf === false) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v - this.xrdjson1[1][i]);
              this.ab2 = this.xrdjson2[0].map((v, i) => 1 - v - this.xrdjson2[1][i]);
          }
          if (this.ts === true && this.rf === true) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1);
              this.ab2 = this.xrdjson2[0].map((v, i) => 1);
          }
          if (this.ts === true && this.rf === false) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v);
              this.ab2 = this.xrdjson2[0].map((v, i) => 1 - v);
          }
          if (this.ts === false && this.rf === true) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - this.xrdjson1[1][i]);
              this.ab2 = this.xrdjson2[0].map((v, i) => 1 - this.xrdjson2[1][i]);
          }
          this.ab = true;
      } else if (event.selected.absorbility === false && this.ab === true) {
          this.ab1 = [];
          this.ab2 = [];
          this.ab = false;
      }
    } else {
        if (event.selected.reflectance === false && this.rf === true) {
            this.rf1 = [];
            this.rf = false;
            if (this.ab === true && this.ts === true) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v);
              } else if (this.ab === true && this.ts === false) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - this.xrdjson1[1][i]);
              }
        } else if (event.selected.reflectance === false && this.rf === false) {
          this.rf1 = this.xrdjson1[0].map((v, i) => v  + this.xrdjson1[1][i]);
          this.rf = true;
          if (this.ab === true && this.ts === true) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1);
            } else if (this.ab === true && this.ts === false) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - this.xrdjson1[1][i]);
            }
        }
        if (event.selected.transmittance === false && this.ts === true) {
          if (this.rf === true) {
              this.ts1 = [];
              this.rf1 = this.xrdjson1[0].map((v, i) => v);
              if (this.ab === true ) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - this.xrdjson1[1][i]);
              }
          } else if ( this.rf === false) {
              this.ts1 = [];
              if (this.ab === true ) {
                  this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v - this.xrdjson1[1][i]);
              }
          }
          this.ts = false;
      } else if (event.selected.transmittance === false && this.ts === false) {
          if (this.rf === true) {
              this.ts1 = this.xrdjson1[1];
              this.rf1 = this.xrdjson1[0].map((v, i) => v  + this.xrdjson1[1][i]);
              if (this.ab === true ) {
                  this.ab1 = this.xrdjson1[0].map((v, i) => 1);
              }
          } else if ( this.rf === false) {
              this.ts1 = this.xrdjson1[1];
              if (this.ab === true ) {
                  this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v);
              }
          }
          this.ts = true;
      }
        if (event.selected.absorbility === false && this.ab === false) {
          if (this.ts === false && this.rf === false) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v - this.xrdjson1[1][i]);
          }
          if (this.ts === true && this.rf === true) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1);
          }
          if (this.ts === true && this.rf === false) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - v);
          }
          if (this.ts === false && this.rf === true) {
              this.ab1 = this.xrdjson1[0].map((v, i) => 1 - this.xrdjson1[1][i]);
          }
          this.ab = true;
      } else if (event.selected.absorbility === false && this.ab === true) {
          this.ab1 = [];
          this.ab = false;
      }
    }
    this.optInit();
}
getdata() {
    this.ab1 = this.xrdjson1[0].map((v, i) => 1);
    this.ts1 = this.xrdjson1[1];
    this.rf1 = this.xrdjson1[0].map((v, i) => v  + this.xrdjson1[1][i]);
    if (this.id2) {
    this.rf2 = this.xrdjson2[0].map((v, i) => v  + this.xrdjson2[1][i]);
    this.ts2 = this.xrdjson2[1];
    this.ab2 = this.xrdjson2[0].map((v, i) => 1);
    }
}
  constructor(private service: MaterialService) { }
  optInit() {
    if (this.id2) {
        this.optoption2 = {
            title: {
                text: this.id2 + ' Optical'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: (params) => {
                    const index = params[0].dataIndex;
                    return [
                        'Wavelength: ' + this.xrdjson2[3][index] + 'nm<br/>',
                        'reflectance: ' + this.xrdjson2[0][index] + '<br/>',
                        'transmittance: ' + this.xrdjson2[1][index] + '<br/>',
                        'absorbility: ' + this.xrdjson2[2][index] + '<br/>'
                    ].join('');
                }
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    dataZoom : {}
                }
            },
            grid: {
                left: '3%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    name: 'wavelen',
                    axisLabel: {
                        formatter: '{value}nm'
                    },
                    type : 'category',
                    boundaryGap : false,
                    data : this.xrdjson2[3]
                }
            ],
            yAxis : [
                {
                    name: 'fraction',
                    type : 'value'
                }
            ],
            series : [
                {
                    name: 'absorbility',
                    type: 'line',
                    lineStyle: { color: 'rgba(5,5,5,1)'},
                    areaStyle: {  color: 'rgba(5,5,5,1)'},
                    data: this.ab2,
                    z: 0
                },
                {
                    name: 'reflectance',
                    type: 'line',
                    lineStyle: { color:  {
                        type: 'linear',
                        x: 1,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        colorStops: [
                            {offset: 0, color: '#FF0000'},
                            {offset: 0.17, color: '#FF7D00'},
                            {offset: 0.34, color: '#FFFF00'},
                            {offset: 0.5, color: '#00FF00'},
                            {offset: 0.67, color: '#00FFFF'},
                            {offset: 0.84, color: '#0000FF'},
                            {offset: 1, color: '#FF00FF'},
                        ]
                    }},
                    areaStyle: { color: {
                        type: 'linear',
                        x: 1,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        colorStops: [
                            {offset: 0, color: '#FF0000'},
                            {offset: 0.17, color: '#FF7D00'},
                            {offset: 0.34, color: '#FFFF00'},
                            {offset: 0.5, color: '#00FF00'},
                            {offset: 0.67, color: '#00FFFF'},
                            {offset: 0.84, color: '#0000FF'},
                            {offset: 1, color: '#FF00FF'},
                        ]
                    }
                },
                    z: 1,
                    data: this.rf2
                },
                {
                    name: 'transmittance',
                    type: 'line',
                    lineStyle: { color: 'rgba(175,175,175,1)'},
                    areaStyle: { color: 'rgba(255,255,255,1)'},
                    z: 2,
                    data: this.ts2
                },
                {
                    name: 'transmittanceCompared',
                    type: 'line',
                    lineStyle: { color: 'rgba(105,105,105,0.7)'},
                    data: this.ts1
                },
                {
                    name: 'reflectanceCompared',
                    type: 'line',
                    lineStyle: { color: 'rgba(105,105,105,0.7)'},
                    data: this.rf1
                },
                {
                    name: 'absorbilityCompared',
                    type: 'line',
                    lineStyle: { color: 'rgba(105,105,105,0.7)'},
                    data: this.ab1
                }
            ]
        };
        this.optoption1 = {
            title: {
                text: this.id1 + ' Optical'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: (params) => {
                            const index = params[0].dataIndex;
                            return [
                                'Wavelength: ' + this.xrdjson1[3][index] + 'nm<br/>',
                                'reflectance: ' + this.xrdjson1[0][index] + '<br/>',
                                'transmittance: ' + this.xrdjson1[1][index] + '<br/>',
                                'absorbility: ' + this.xrdjson1[2][index] + '<br/>',
                                'reflectanceCompared: ' + this.xrdjson2[0][index] + '<br/>',
                                'transmittanceCompared: ' + this.xrdjson2[1][index] + '<br/>',
                            ].join('');
                        }
            },
            legend: {
                data: ['transmittance', 'reflectance', 'absorbility']
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    dataZoom : {}
                }
            },
            grid: {
                left: '3%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    name: 'wavelen',
                    axisLabel: {
                        formatter: '{value}nm'
                    },
                    type : 'category',
                    boundaryGap : false,
                    data : this.xrdjson1[3]
                }
            ],
            yAxis : [
                {
                    name: 'fraction',
                    type : 'value'
                }
            ],
            series : [
                {
                    name: 'absorbility',
                    type: 'line',
                    lineStyle: { color: 'rgba(5,5,5,1)'},
                    areaStyle: {  color: 'rgba(5,5,5,1)'},
                    data: this.ab1,
                    z: 0
                },
                {
                    name: 'reflectance',
                    type: 'line',
                    lineStyle: { color:  {
                        type: 'linear',
                        x: 1,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        colorStops: [
                            {offset: 0, color: '#FF0000'},
                            {offset: 0.17, color: '#FF7D00'},
                            {offset: 0.34, color: '#FFFF00'},
                            {offset: 0.5, color: '#00FF00'},
                            {offset: 0.67, color: '#00FFFF'},
                            {offset: 0.84, color: '#0000FF'},
                            {offset: 1, color: '#FF00FF'},
                        ]
                    }},
                    areaStyle: { color: {
                        type: 'linear',
                        x: 1,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        colorStops: [
                            {offset: 0, color: '#FF0000'},
                            {offset: 0.17, color: '#FF7D00'},
                            {offset: 0.34, color: '#FFFF00'},
                            {offset: 0.5, color: '#00FF00'},
                            {offset: 0.67, color: '#00FFFF'},
                            {offset: 0.84, color: '#0000FF'},
                            {offset: 1, color: '#FF00FF'},
                        ]
                    }
                },
                    z: 1,
                    data: this.rf1
                },
                {
                    name: 'transmittance',
                    type: 'line',
                    lineStyle: { color: 'rgba(175,175,175,1)'},
                    areaStyle: { color: 'rgba(255,255,255,1)'},
                    z: 2,
                    data: this.ts1
                },
                {
                    name: 'transmittanceCompared',
                    type: 'line',
                    lineStyle: { color: 'rgba(105,105,105,0.7)'},
                    data: this.ts2
                },
                {
                    name: 'reflectanceCompared',
                    type: 'line',
                    lineStyle: { color: 'rgba(105,105,105,0.7)'},
                    data: this.rf2
                },
                {
                    name: 'absorbilityCompared',
                    type: 'line',
                    lineStyle: { color: 'rgba(105,105,105,0.7)'},
                    data: this.ab2
                }
            ]
        };
    } else {
        this.optoption1 = {
            title: {
                text: this.id1 + ' Optical'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: {
                        backgroundColor: '#6a7985'
                    }
                },
                formatter: (params) => {
                    const index = params[0].dataIndex;
                    return [
                        'Wavelength: ' + this.xrdjson1[3][index] + 'nm<br/>',
                        'reflectance: ' + this.xrdjson1[0][index] + '<br/>',
                        'transmittance: ' + this.xrdjson1[1][index] + '<br/>',
                        'absorbility: ' + this.xrdjson1[2][index] + '<br/>',
                    ].join('');
                }
            },
            legend: {
                data: ['transmittance', 'reflectance', 'absorbility']
            },
            toolbox: {
                feature: {
                    saveAsImage: {},
                    dataZoom : {}
                }
            },
            grid: {
                left: '3%',
                right: '10%',
                bottom: '3%',
                containLabel: true
            },
            xAxis : [
                {
                    name: 'wavelen',
                    axisLabel: {
                        formatter: '{value}nm'
                    },
                    type : 'category',
                    boundaryGap : false,
                    data : this.xrdjson1[3]
                }
            ],
            yAxis : [
                {
                    name: 'fraction',
                    type : 'value'
                }
            ],
            series : [
                {
                    name: 'absorbility',
                    type: 'line',
                    lineStyle: { color: 'rgba(5,5,5,1)'},
                    areaStyle: {  color: 'rgba(5,5,5,1)'},
                    data: this.ab1,
                    z: 0
                },
                {
                    name: 'reflectance',
                    type: 'line',
                    lineStyle: { color:  {
                        type: 'linear',
                        x: 1,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        colorStops: [
                            {offset: 0, color: '#FF0000'},
                            {offset: 0.17, color: '#FF7D00'},
                            {offset: 0.34, color: '#FFFF00'},
                            {offset: 0.5, color: '#00FF00'},
                            {offset: 0.67, color: '#00FFFF'},
                            {offset: 0.84, color: '#0000FF'},
                            {offset: 1, color: '#FF00FF'},
                        ]
                    }},
                    areaStyle: { color: {
                        type: 'linear',
                        x: 1,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        colorStops: [
                            {offset: 0, color: '#FF0000'},
                            {offset: 0.17, color: '#FF7D00'},
                            {offset: 0.34, color: '#FFFF00'},
                            {offset: 0.5, color: '#00FF00'},
                            {offset: 0.67, color: '#00FFFF'},
                            {offset: 0.84, color: '#0000FF'},
                            {offset: 1, color: '#FF00FF'},
                        ]
                    }
                },
                    z: 1,
                    data: this.rf1
                },
                {
                    name: 'transmittance',
                    type: 'line',
                    lineStyle: { color: 'rgba(175,175,175,1)'},
                    areaStyle: { color: 'rgba(255,255,255,1)'},
                    z: 2,
                    data: this.ts1
                },
            ]
        };
    }
 }

 eleInit() {
    const tmp = [this.elejson.map( ele => ele[2])];
    const data = prepareBoxplotData(tmp);
    this.eleoption = {
        title: {
            text: 'Overview'
        },
        toolbox: {
        },
        tooltip: {},
        xAxis: {
            name: 'x',
            type: 'value'
            },
            yAxis: {
                name: 'y',
                type: 'value'
            },
            grid: {
                width: '35%',
                left: '60%'
            },
            grid3D: {
            width: '60%',
            left: 'left',
            axisLine: {
                lineStyle: {
                    color: 'white'
                }
            },
            viewControl: {
                projection: 'orthographic',
                distance: 300,
                rotateSensitivity: [1, 1]
            }
        },
        xAxis3D: {
            type: 'value',
            },
            yAxis3D: {
                type: 'value',
            },
            zAxis3D: {
                type: 'value',
                },
            visualMap: {
                min: 0,
                max: 2,
                calculable: true,
                realtime: false,
                inRange: {
                    color: COLORS
                },
                orient: 'horizontal',
                dimension: 'resistance',
                left: '66%',
                bottom: 'bottom'

            },
            dataset: {
                dimensions: [
                    'x',
                    'y',
                    'z',
                    'resistance',
                    'id'
                ],
                source: this.elejson  },
            series: [
                {
                    name: 'ElectricRes',
                    type: 'heatmap',
                    encode: {
                        x: 'x',
                        y: 'y',
                        tooltip: [0, 1, 2, 3, 4]
                    }
                },
                {
                    name: 'Electric',
                    barSize: 10,
                    bevelSize: 0.4,
                    bevelSmoothness: 4,
                    barGap: '0%',
                    type: 'bar3D',
                    shading: 'realistic',
                    encode: {
                        x: 'x',
                        y: 'y',
                        z: 'z',
                        tooltip: [0, 1, 2, 3, 4]
                    }
                }
            ]
};
    this.stsoption = {
        title: [
            {
                text: 'Roughness'
            },
            {
                text: 'upper: Q3 + 1.5 * IQR \nlower: Q1 - 1.5 * IQR',
                borderColor: '#999',
                borderWidth: 1,
                textStyle: {
                    fontSize: 12
                },
                left: '8%',
                top: '90%'
            }
        ],
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '20%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: data.axisData,
            axisLabel: {
                formatter: 'Material'
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: 'nm?',
            splitArea: {
                show: true
            }
        },
        series: [
            {
                name: 'boxplot',
                type: 'boxplot',
                data: data.boxData,
                tooltip: {
                    formatter: param => {
                        return [
                            'Material: ',
                            'upper: ' + param.data[5],
                            'Q3: ' + param.data[4],
                            'median: ' + param.data[3],
                            'Q1: ' + param.data[2],
                            'lower: ' + param.data[1]
                        ].join('<br/>'); }
                }
            },
            {
                name: 'outlier',
                type: 'scatter',
                data: data.outliers
            },
            {
                type: 'scatter',
                color: 'rgba(235,123,34,0.3)',
                data: tmp[0]
            },
        ]
    };
    //注意：我这里没有用原数据文件，而是把处理之后的数据又转回去了，你最好能直接使用原本的数据、
    const sheet= this.elejson.map(e => [e[0],e[1],e[2]*e[3],e[4]]);
    this.sroption = {
        title: {

            text: 'Sheet Resistance'
        },
        tooltip: {},
            xAxis: {
            name: 'x',
            type: 'category'
            },
            yAxis: {
                name: 'y',
                type: 'category'
            },
            grid: {
                left: '15%',
                right: '10%'
            },
            visualMap: {
                //自己去求数组的最大最小值，我这就写了个常数做demo
                min: 0,
                max: 70000,
                show: false,
                calculable: true,
                realtime: false,
                inRange: {
                    color: ['rgba(255,255,255,1)', 'rgba(0,0,0,1)']
                },
                dimension: 'sheetResistance',
                orient: 'horizontal',
                left: '20%',
                bottom: 'bottom',
            },
            dataset: {
                dimensions: [
                    'x',
                    'y',
                    'sheetResistance',
                    'id'
                ],
                source: sheet  },
            series: [
                {
                    name: 'ElectricRes',
                    type: 'heatmap',
                    encode: {
                        x: 'x',
                        y: 'y',
                        tooltip: [0, 1, 2, 3]
                    }
                }
            ]
};
}

    ngOnInit() {
        this.getlib();
}

onClick(params) {
    this.id2 = this.id1;
    this.id1 = params.data[4];
    this.service.getXrd(this.id1).subscribe(xrd => {
        this.xrdjson1 = xrd;
        this.ab = true;
        this.rf = true;
        this.ts = true;
        if (this.id2) {
            this.service.getXrd(this.id2).subscribe(xrd2 => {
                this.xrdjson2 = xrd2;
                this.getdata();
                this.optInit();
            });
        } else {
            this.getdata();
            this.optInit();
        }
    });
}
onClickH(params) {
    this.id2 = this.id1;
    this.id1 = params.data[3];
    this.service.getXrd(this.id1).subscribe(xrd => {
        this.xrdjson1 = xrd;
        this.ab = true;
        this.rf = true;
        this.ts = true;
        if (this.id2) {
            this.service.getXrd(this.id2).subscribe(xrd2 => {
                this.xrdjson2 = xrd2;
                this.getdata();
                this.optInit();
            });
        } else {
            this.getdata();
            this.optInit();
        }
    });
}
}
