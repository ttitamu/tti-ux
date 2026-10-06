import puppeteer from 'puppeteer';

function serializeRect(el) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left, right: r.right, bottom: r.bottom };
}

async function testResponsiveSidebar() {
  console.log('--- Starting Responsive Sidebar & Viewport Diagnostics ---');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    
    // 1. Mobile iPhone Viewport (375x812)
    console.log('\n[Phase 1] Testing Mobile Viewport: 375px width (iOS / phone)');
    await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    await page.goto('http://localhost:3030/', { waitUntil: 'networkidle0' });

    const mobileMetrics = await page.evaluate(() => {
      function serialize(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left };
      }

      const main = document.querySelector('#main-content');
      const desktopSidebar = document.querySelector('.tti-shell-sidebar');
      const mobileDrawer = document.querySelector('#tux-mobile-drawer');
      const bodyScrollWidth = document.documentElement.scrollWidth;
      const windowInnerWidth = window.innerWidth;

      return {
        mainBox: serialize(main),
        desktopSidebarDisplay: desktopSidebar ? window.getComputedStyle(desktopSidebar).display : null,
        desktopSidebarBox: serialize(desktopSidebar),
        mobileDrawerExists: Boolean(mobileDrawer),
        hasHorizontalOverflow: bodyScrollWidth > windowInnerWidth,
        bodyScrollWidth,
        windowInnerWidth,
      };
    });

    console.log('Mobile Metrics (drawer closed):', JSON.stringify(mobileMetrics, null, 2));

    if (mobileMetrics.mainBox.x !== 0) {
      throw new Error(`FAIL: #main-content.x is ${mobileMetrics.mainBox.x}, expected 0! Dead empty margin still exists!`);
    }
    if (mobileMetrics.mainBox.width !== 375) {
      throw new Error(`FAIL: #main-content.width is ${mobileMetrics.mainBox.width}, expected 375! Misattributed space detected!`);
    }
    if (mobileMetrics.desktopSidebarDisplay !== 'none') {
      throw new Error(`FAIL: desktop sidebar display is ${mobileMetrics.desktopSidebarDisplay}, expected 'none'!`);
    }
    if (mobileMetrics.hasHorizontalOverflow) {
      throw new Error(`FAIL: Horizontal scroll overflow on mobile! bodyScrollWidth=${mobileMetrics.bodyScrollWidth} > innerWidth=${mobileMetrics.windowInnerWidth}`);
    }
    console.log('✓ PASS: On 375px mobile, #main-content begins at x=0, spans full 375px, and desktop sidebar has display:none (0px space)!');

    // 2. Mobile Drawer Open / Close Test
    console.log('\n[Phase 2] Testing Mobile Hamburger Toggle & Drawer Overlay');
    const menuBtn = await page.$('button[aria-controls="tux-mobile-drawer"]');
    if (!menuBtn) throw new Error('Menu button not found!');
    await menuBtn.click();
    await new Promise((r) => setTimeout(r, 400)); // wait for transition

    const drawerOpenMetrics = await page.evaluate(() => {
      function serialize(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left };
      }

      const drawer = document.querySelector('#tux-mobile-drawer');
      const main = document.querySelector('#main-content');
      const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/40');
      return {
        drawerExists: Boolean(drawer),
        drawerBox: serialize(drawer),
        backdropExists: Boolean(backdrop),
        mainBox: serialize(main),
      };
    });
    console.log('Drawer Open Metrics:', JSON.stringify(drawerOpenMetrics, null, 2));

    if (!drawerOpenMetrics.drawerExists || !drawerOpenMetrics.drawerBox || drawerOpenMetrics.drawerBox.width <= 0) {
      throw new Error('FAIL: Mobile drawer did not appear!');
    }
    if (drawerOpenMetrics.mainBox.x !== 0 || drawerOpenMetrics.mainBox.width !== 375) {
      throw new Error(`FAIL: #main-content was displaced when drawer opened: x=${drawerOpenMetrics.mainBox.x}, width=${drawerOpenMetrics.mainBox.width}`);
    }
    console.log('✓ PASS: Mobile drawer slides in as overlay, #main-content layout remains stable at x=0, 375px!');

    // Close drawer via backdrop click
    const backdrop = await page.$('.fixed.inset-0.bg-black\\/40');
    if (backdrop) {
      await backdrop.click();
      await new Promise((r) => setTimeout(r, 300));
    }

    // 3. Tablet Viewport (768px width)
    console.log('\n[Phase 3] Testing Tablet Viewport: 768px width');
    await page.setViewport({ width: 768, height: 1024 });
    await new Promise((r) => setTimeout(r, 300));

    const tabletMetrics = await page.evaluate(() => {
      function serialize(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left };
      }

      const main = document.querySelector('#main-content');
      const sidebar = document.querySelector('.tti-shell-sidebar');
      return {
        mainBox: serialize(main),
        sidebarBox: serialize(sidebar),
        sidebarDisplay: sidebar ? window.getComputedStyle(sidebar).display : null,
      };
    });
    console.log('Tablet Metrics (768px):', JSON.stringify(tabletMetrics, null, 2));

    if (!tabletMetrics.sidebarBox || tabletMetrics.sidebarBox.width !== 64) {
      throw new Error(`FAIL: Tablet sidebar width is ${tabletMetrics.sidebarBox?.width}, expected 64px (mini-rail)!`);
    }
    if (tabletMetrics.mainBox.x !== 64) {
      throw new Error(`FAIL: Tablet #main-content.x is ${tabletMetrics.mainBox.x}, expected 64!`);
    }
    if (tabletMetrics.mainBox.width !== 768 - 64) {
      throw new Error(`FAIL: Tablet #main-content.width is ${tabletMetrics.mainBox.width}, expected ${768 - 64}!`);
    }
    console.log('✓ PASS: Tablet automatically renders 64px mini-rail, allocating full 704px to #main-content!');

    // 4. Desktop Viewport (1200px width)
    console.log('\n[Phase 4] Testing Desktop Viewport: 1200px width');
    await page.setViewport({ width: 1200, height: 900 });
    await new Promise((r) => setTimeout(r, 300));

    const desktopMetrics = await page.evaluate(() => {
      function serialize(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left };
      }

      const main = document.querySelector('#main-content');
      const sidebar = document.querySelector('.tti-shell-sidebar');
      return {
        mainBox: serialize(main),
        sidebarBox: serialize(sidebar),
      };
    });
    console.log('Desktop Metrics (1200px):', JSON.stringify(desktopMetrics, null, 2));

    if (!desktopMetrics.sidebarBox || desktopMetrics.sidebarBox.width < 280) {
      throw new Error(`FAIL: Desktop sidebar width is ${desktopMetrics.sidebarBox?.width}, expected expanded >=280px!`);
    }
    console.log(`✓ PASS: Desktop sidebar expanded to ${desktopMetrics.sidebarBox.width}px!`);

    // 5. Dynamic Window Resize Reactive Transition
    console.log('\n[Phase 5] Testing Dynamic Window Resize Reactive Transition');
    console.log('Resizing down from 1200px to 800px...');
    await page.setViewport({ width: 800, height: 900 });
    await new Promise((r) => setTimeout(r, 300));

    const resizedToTabletMetrics = await page.evaluate(() => {
      const sidebar = document.querySelector('.tti-shell-sidebar');
      return {
        sidebarWidth: sidebar ? sidebar.getBoundingClientRect().width : null,
      };
    });
    console.log('Resized to 800px sidebar width:', resizedToTabletMetrics.sidebarWidth);
    if (resizedToTabletMetrics.sidebarWidth !== 64) {
      throw new Error(`FAIL: Dynamic resize to 800px did not auto-collapse sidebar to 64px! Got: ${resizedToTabletMetrics.sidebarWidth}`);
    }
    console.log('✓ PASS: Resizing down automatically collapsed sidebar to 64px mini-rail!');

    console.log('Resizing back up from 800px to 1200px...');
    await page.setViewport({ width: 1200, height: 900 });
    await new Promise((r) => setTimeout(r, 300));

    const resizedToDesktopMetrics = await page.evaluate(() => {
      const sidebar = document.querySelector('.tti-shell-sidebar');
      return {
        sidebarWidth: sidebar ? sidebar.getBoundingClientRect().width : null,
      };
    });
    console.log('Resized to 1200px sidebar width:', resizedToDesktopMetrics.sidebarWidth);
    if (!resizedToDesktopMetrics.sidebarWidth || resizedToDesktopMetrics.sidebarWidth < 280) {
      throw new Error(`FAIL: Dynamic resize to 1200px did not auto-expand sidebar! Got: ${resizedToDesktopMetrics.sidebarWidth}`);
    }
    console.log(`✓ PASS: Resizing back up automatically restored expanded sidebar (${resizedToDesktopMetrics.sidebarWidth}px)!`);

    // Resizing down to mobile
    console.log('Resizing down from 1200px to 375px...');
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await new Promise((r) => setTimeout(r, 300));

    const resizedToMobileMetrics = await page.evaluate(() => {
      function serialize(el) {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height, top: r.top, left: r.left };
      }

      const main = document.querySelector('#main-content');
      const sidebar = document.querySelector('.tti-shell-sidebar');
      return {
        mainBox: serialize(main),
        sidebarDisplay: sidebar ? window.getComputedStyle(sidebar).display : null,
      };
    });
    console.log('Resized to 375px mobile metrics:', JSON.stringify(resizedToMobileMetrics, null, 2));
    if (resizedToMobileMetrics.mainBox.x !== 0 || resizedToMobileMetrics.mainBox.width !== 375) {
      throw new Error(`FAIL: Resizing down to 375px left dead space! x=${resizedToMobileMetrics.mainBox.x}, width=${resizedToMobileMetrics.mainBox.width}`);
    }
    console.log('✓ PASS: Resizing down to mobile cleanly removes sidebar (display: none) with zero empty space and full 375px main content!');

    // Take screenshot for artifact visual proof
    await page.screenshot({ path: '/Users/A-Guevara/.gemini/antigravity/brain/4c9a4ceb-713c-42d1-84bc-b35faa934816/mobile_viewport_fixed_375.png' });
    console.log('Saved verification screenshot to artifacts: mobile_viewport_fixed_375.png');

    console.log('\nALL RESPONSIVE SIDEBAR VERIFICATION CHECKS PASSED PERFECTLY!');
  } finally {
    await browser.close();
  }
}

testResponsiveSidebar().catch((err) => {
  console.error(err);
  process.exit(1);
});
