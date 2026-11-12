// 실행: ego-browser nodejs < 절대경로/tests/layout-overlap.mjs
// 사전 조건: 이 저장소를 http://127.0.0.1:8946 에서 제공한다.
const task = await taskSpace("가계도 잘림 조사");
const pages = await task.pages();
const page = pages.length > 1 ? task.page("p2") : await task.newPage();
await page.goto("http://127.0.0.1:8946/");
const results = await page.evaluate(() => {
  const results = [];
  for (const childRel of ["조카", "자녀"]) {
    people = [{id: 1, name: "기준", relation: "망인", status: "deceased"}];
    if (childRel === "조카") people.push({id: 2, name: "형제", relation: "형제자매", status: "alive"});
    for (let i = 0; i < 3; i++) {
      people.push({id: 10+i, name: `부모${i}`, relation: childRel, parentId: childRel === "조카" ? "2" : "", status: "alive"});
      if (i === 1) continue; // 자녀 없는 부모를 사이에 둔 두 집안
      for (let j = 0; j < 3; j++) people.push({id: 100+i*10+j, name: `아래${i}-${j}`, relation: childRel === "조카" ? "질손" : "손자녀", parentId: String(10+i), status: "renounce"});
    }
    render();
    const boxes = [...document.querySelectorAll(".person-box")].map(g => ({id: g.dataset.pid, x: +g.dataset.bx, y: +g.dataset.by}));
    const overlaps = [];
    boxes.forEach((a, i) => boxes.slice(i+1).forEach(b => {
      if (Math.abs(a.x-b.x) < 116 && Math.abs(a.y-b.y) < 60) overlaps.push([a.id, b.id]);
    }));
    results.push({childRel, count: boxes.length, expected: people.length, overlaps});
  }
  return results;
});
console.log(results);
if (results.some(r => r.count !== r.expected || r.overlaps.length)) throw new Error("가계도 인원 누락 또는 상자 겹침");
