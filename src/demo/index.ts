import { Area, Point, Scene, Segment } from '../renderer'
import * as Colors from '../colors'
import * as Geo from '../geometry'
import { pairwiseCircular } from '../utils'
import Circle from '../renderer/circle'

const canvas = document.createElement('canvas')
document.body.append(canvas)
const ctx = canvas.getContext('2d')!
const scene = new Scene(ctx)

const points = [
  new Point(460, 180).setLabel('A').setColor(Colors.Clrs.RED).setSize(5),
  new Point(400, 240).setLabel('B'),
  new Point(860, 240),
  new Point(860, 280),
  new Point(400, 280),
  new Point(400, 400),
  new Point(240, 320),
  new Point(240, 200),
  new Point(400, 120),
]

const area = new Area(points)
const segments = Segment.Polygon(points)

const circle = new Circle(points[2], 50)

function virtual () {
  const intersectionGeo = Geo.algorithms.closestPointOnLineToPoint(points[4], points[5], points[2])
  const intersection = new Point(intersectionGeo.x, intersectionGeo.y).setLabel('X')
  return [intersection]
}

const referentPoint = new Point(300, 200)
  .setSize(8)
  .setColor(Colors.Clrs.LIME)

function update () {
  const aabb = Geo.Aabb.compute(points, 5)
  const { top } = Geo.Aabb.getRayEndpoints(referentPoint, aabb)
  const count = getIntersectionCount(referentPoint, top, points)
  const color = count % 2 == 1 ? Colors.Clrs.LIME : Colors.Clrs.FUCHSIA
  referentPoint.setColor(color)
}

update()

scene
  .setSize(1000, 600)
  .add(area, ...segments, ...points, referentPoint, circle)
  .addVirtualObjects(virtual)
  .onUpdate(update)
  .drawAll()

function getIntersectionCount (p1: Geo.Point.T, p2: Geo.Point.T, polygon: Geo.Point.T[]) {
  let numberOfIntersections: number = 0
  const polygonSegments = pairwiseCircular(points)
  for (const [poly1, poly2] of polygonSegments) {
    const intersectionResult = Geo.VectorIntersection.exists(p1, p2, poly1, poly2)
    if (intersectionResult == Geo.VectorIntersection.IntersectionType.Point) {
      numberOfIntersections++
    }
  }
  return numberOfIntersections
}
