<script setup lang="ts">
import { hosts, kpis, loadTrend } from "./ops-board.demo-data";

useHead({ title: "Example · ops board · TUX" });
</script>

<template>
  <div class="space-y-8">
    <TuxPageHeader eyebrow="product · operations" title="Ops board">
      Owned operator document — the composition Nagios, AAP, and any
      monitoring pane should assemble from TUX rather than forking
      Core HTML. Hairline chrome, gold heading keyline, status ramp
      from <code>--status-*</code>. Not a maroon slab.
    </TuxPageHeader>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="k in kpis"
        :key="k.label"
        class="p-4 bg-surface-raised border border-surface-border rounded-md"
      >
        <p class="eyebrow">{{ k.label }}</p>
        <div class="mt-2 flex items-end justify-between gap-3">
          <span class="text-3xl font-bold tracking-tight">{{ k.value }}</span>
          <TuxStatus :state="k.state" />
        </div>
      </div>
    </div>

    <section>
      <h2 class="tux-ops-heading text-lg">Current problems</h2>
      <p class="mt-3 mb-4 text-sm text-text-secondary flex items-center gap-2">
        Poller load
        <TuxSparkline :data="loadTrend" :width="120" :height="28" show-area />
      </p>
      <div class="overflow-x-auto rounded-lg border border-surface-border">
        <table class="tux-ops-table w-full">
          <thead>
            <tr>
              <th>Host</th>
              <th>Service</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Status information</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="h in hosts"
              :key="h.name + h.service"
              :class="`tux-status-row--${h.state}`"
            >
              <td>{{ h.name }}</td>
              <td>{{ h.service }}</td>
              <td><TuxStatus :state="h.state" /></td>
              <td>{{ h.duration }}</td>
              <td>{{ h.info }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
