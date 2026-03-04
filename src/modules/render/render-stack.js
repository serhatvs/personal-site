function groupByStack(items) {
  return items.reduce((groups, item) => {
    const group = groups.get(item.group) || []
    group.push(item)
    groups.set(item.group, group)
    return groups
  }, new Map())
}

export function renderStack(container, stackItems) {
  if (!container) {
    return
  }

  const groups = groupByStack(stackItems)

  container.innerHTML = Array.from(groups.entries())
    .map(
      ([group, items]) => `
        <article data-reveal-item class="stack-group">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="eyebrow text-topaz-300">${group}</p>
              <h3 class="mt-2 text-2xl font-display tracking-[-0.04em] text-mist-50">${group}</h3>
            </div>
            <span class="chip chip-ghost !text-[0.62rem]">${items.length} modules</span>
          </div>

          <div class="mt-6 grid gap-4 md:grid-cols-3">
            ${items
              .map(
                (item) => `
                  <article class="stack-tile js-tech-tile">
                    <span class="icon-frame shrink-0 text-amethyst-50">
                      <i data-lucide="${item.icon}"></i>
                    </span>
                    <div>
                      <h4 class="text-base font-medium text-mist-50">${item.name}</h4>
                      <p class="mt-2 text-sm leading-7 text-mist-200/65">
                        Tuned for premium visuals, clean modules, and resilient shipping.
                      </p>
                    </div>
                  </article>
                `,
              )
              .join('')}
          </div>
        </article>
      `,
    )
    .join('')
}
