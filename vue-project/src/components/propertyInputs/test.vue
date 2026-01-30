              <div v-show="isOpen" class="dropdown-menu" @click.stop>

                    <template v-if="currentDataTable && currentDataTable.value">
                        <div
                            v-for="f in currentDataTable.value.getEncodableFields(propDef.channel)"
                            :key="f"
                            class="dropdown-item"
                        >
                            
                            <!-- if there are scales -->
                            <div v-if="hasScales(f)" @click="encode(f, propDef.channel)"> {{ f }} </div>
                            
                            <!-- else -->
                            <div v-else class="dropdown-submenu">
                                <div class="dropdown-item dropdown-toggle" @mouseenter="showSubmenu(f)">
                                    {{ f }}
                                </div>
                                
                                <div v-show="activeSubmenu === f" class="dropdown-menu dropdown-submenu-menu">
                                    <div 
                                    class="dropdown-item"
                                    @click="encode(f, propDef.channel)"
                                    >
                                    Create new scale
                                    </div>
                                    
                                    <div
                                    v-for="(enc, idx) in getScaleOptions(f)"
                                    :key="enc.scale.id + '_' + idx"
                                    class="dropdown-item"
                                    @click="encode(f, propDef.channel, enc.scale)"
                                    @mouseenter="highlightAxis(enc.scale, true)"
                                    @mouseleave="highlightAxis(enc.scale, false)"
                                    >
                                    Merge with {{ enc.fields }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </template>

                </div>