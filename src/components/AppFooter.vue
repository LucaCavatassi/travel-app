<script>
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <ul class="d-flex gap-2 align-items-center m-0 h-100 p-0">
                    <li>© 2024 Travel-Diary</li>
                    <li>-</li>
                    <li>Developed by <a href="https://github.com/LucaCavatassi">Luca Maria Cavatassi</a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use "../style/general" as *;

    .row{
        height: 50px;
        background-color: $blue;
        .col{
            color: white;
            ul{
                text-decoration: none;
                list-style: none;
                li {
                    font-size: 0.8rem;
                    a {
                        color: $purple;
                    }
                    a:hover {
                        color: $light-purple;
                    }
                }
            }
        }  
    }
</style>
