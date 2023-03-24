<template>
<div>
    <v-data-table :items="expansionBoards" :headers="headers" @contextmenu:row.stop.prevent="rowClicked"></v-data-table>
    <input-dialog isNumericValue :shown.sync="showNewCanAddressDialog" title="Update CAN Address" :prompt="canUpdatePrompt" @confirmed="updateCANAddress"></input-dialog>
    <v-menu v-model="contextMenu.shown" :position-x="contextMenu.x" :position-y="contextMenu.y" absolute  >        
        <v-list>
            <v-list-item @click="showNewCanAddressDialog = true">Update CAN Address</v-list-item>
            <v-list-item @click="runM122">M122</v-list-item>
        </v-list>
    </v-menu>
</div>    
</template>
<style></style>
<script>
'use strict'

import { mapState, mapActions } from "vuex"
import InputDialog from '../../components/dialogs/InputDialog.vue'

export default {
  components: { InputDialog },

    data() {
        return {
            headers: [
                {
                    text: 'Name',
                    value: 'name',
                    sortable: true,
                },
                {
                    text: 'CAN Address',
                    value: 'canAddress',
                    sortable: true,
                }      ,          
                {
                    text: 'State',
                    value: 'state',
                    sortable: true,
                },
                {
                    text: 'Firmware Version',
                    value: 'firmwareVersion',
                    sortable: true,
                },
                {
                    text: 'Firmware Date',
                    value: 'firmwareDate',
                    sortable: true,
                },
                {
                    text: 'MCU Temp',
                    value: 'mcuTemp.current',
                    sortable: true,
                },                
                {
                    text: 'Vin',
                    value: 'vIn.current',
                    sortable: true,
                },                

            ],
            showNewCanAddressDialog : false,
            contextMenu: {
				shown: false,
				touchTimer: undefined,
				x: 0,
				y: 0
			},
            selectedBoard: undefined,
        }
    },
    computed: {
        ...mapState('machine/model', ['boards']),
        expansionBoards() {
            return this.boards.filter(board => board.canAddress > 0)
        },
        canUpdatePrompt() {
            if(this.selectedBoard != undefined){
                return 'Update address for ' + this.selectedBoard.name + ":" + this.selectedBoard.canAddress;
            }
            return ''
        }

    },
    methods:{
        ...mapActions('machine',['sendCode']),
        rowClicked(e, row)
        {
            this.contextMenu.shown = false;
            this.contextMenu.x = e.x;
            this.contextMenu.y = e.y;
            this.$nextTick(() => {
				this.contextMenu.shown = true;
			});
            this.selectedBoard = row.item;
        },
        async updateCANAddress(value){
            console.log(`Result : ${value}`);
            if(this.selectedBoard !== undefined){
                console.log(`M952 B${this.selectedBoard.canAddress} A${value}`)
              await this.sendCode(`M952 B${this.selectedBoard.canAddress} A${value}`);
              
            }
        },
        async runM122(value) {
            await this.sendCode(`M122 B${this.selectedBoard.canAddress}`);
            this.$router.push("/Console");
        }
    }
}


</script>