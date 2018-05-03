class Chart {
    constructor(ctx,type,data){
        this.ctx = ctx;
        this.type = type;
        this.data = data;
    }
    drawArc(startAngle,endAngle,color){
        const ctx = this.ctx;
        const width = this.data.width;
        const height = this.data.height;
        const radius = this.data.radius;
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, (360 - startAngle) / 360 * 2 * Math.PI, (360 - endAngle) / 360 * 2 * Math.PI, false)
        ctx.lineTo(width / 2, height / 2)
        ctx.lineTo(width, height / 2)
        ctx.closePath()
        ctx.setFillStyle(color);
        ctx.fill()
    }
    drawPieChart(){
        const ctx = this.ctx;
        const ratio = this.data.ratio;
        const width = this.data.width;
        const height = this.data.height;
        const radius = this.data.radius;
        const colors = this.data.colors;
        /* 扇形一 */
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0,  2*Math.PI*ratio, false)
        ctx.lineTo(width / 2, height / 2)
        ctx.lineTo(width, height / 2)
        ctx.closePath()
        ctx.setFillStyle(colors[0]);
        ctx.fill()
        /* 扇形二 */
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI * ratio, true)
        ctx.lineTo(width / 2, height / 2)
        ctx.lineTo(width, height / 2)
        ctx.closePath()
        ctx.setFillStyle(colors[1]);
        ctx.fill()
        ctx.draw()
    }
    
    draw(){
        const ctx = this.ctx
        this.type == 'pieChart' && this.drawPieChart(ctx)
    }


}

module.exports = Chart;