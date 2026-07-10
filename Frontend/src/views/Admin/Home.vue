<template>
  <div class="flex flex-col gap-6">
    <section class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-6">
      <p class="text-sm font-medium uppercase tracking-wide text-primary-600">Administration</p>
      <h1 class="mt-2 text-2xl font-bold text-gray-900">Tableau de bord</h1>
      <p class="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
        Retrouvez ici les raccourcis de gestion du site. Cette page reste lisible sur mobile,
        tablette et grand écran en attendant les prochains indicateurs métier.
      </p>
    </section>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <article class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Chats</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500">
          Gérez les fiches, les médias et les informations d’adoption.
        </p>
      </article>

      <article class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Demandes</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500">
          Suivez les demandes d’adoption et leur traitement par l’équipe.
        </p>
      </article>

      <article class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <h2 class="text-base font-semibold text-gray-900">Organisation</h2>
        <p class="mt-2 text-sm leading-6 text-gray-500">
          Centralisez les absences, relais et réglages utiles au fonctionnement.
        </p>
      </article>
    </section>
  </div>
</template>
